import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as EmailTemplate from '../../db/EmailTemplate';
import { EmailTemplate as EmailTemplateType } from '../../db/types';

interface Template {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  last_modified: string | null;
  type?: string;
  is_default?: boolean;
  user_id?: string;
}

export default function EmailTemplates() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, string>>({});
  const [previewHtml, _] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadTemplates();
  }, [user, navigate]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    const variables = Array.isArray(template.variables) ? template.variables : [];
    const initialPreviewData: Record<string, string> = {};
    
    variables.forEach(variable => {
      initialPreviewData[variable] = `Valeur de test pour ${variable}`;
    });
    
    setPreviewData(initialPreviewData);
  };

  const handleSave = async () => {
    if (!selectedTemplate || !user) return;

    setIsSaving(true);
    try {
      const { data, error } = await EmailTemplate.updateTemplate({
        id: selectedTemplate.id,
        subject: selectedTemplate.subject,
        content: selectedTemplate.content,
        variables: Array.isArray(selectedTemplate.variables) ? selectedTemplate.variables : [],
        userId: user.id
      });

      if (error) throw error;
      setMessage({ 
        type: 'success', 
        text: 'Template sauvegardé avec succès' 
      });
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      setMessage({ 
        type: 'error', 
        text: 'Erreur lors de la sauvegarde' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const { data, error } = await EmailTemplate.getTemplates();

      if (error) throw error;
      
      const formattedTemplates = data.map((template: EmailTemplateType) => ({
        ...template,
        variables: Array.isArray(template.variables) ? template.variables : []
      })) as Template[];
      
      setTemplates(formattedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      setMessage({ 
        type: 'error', 
        text: 'Erreur lors du chargement des templates' 
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des Templates d'Emails</h1>
      
      {message.text && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message.text}
        </div>
      )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Liste des templates */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Templates</h2>
            <ul className="space-y-2">
              {templates.map(template => (
                <li
                  key={template.id}
                  className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                    selectedTemplate?.id === template.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  {template.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Éditeur de template */}
          {selectedTemplate && (
            <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Éditer le Template</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sujet</label>
                  <input
                    type="text"
                    value={selectedTemplate.subject}
                    onChange={e => setSelectedTemplate({
                      ...selectedTemplate,
                      subject: e.target.value
                    })}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Contenu HTML</label>
                  <textarea
                    value={selectedTemplate.content}
                    onChange={e => setSelectedTemplate({
                      ...selectedTemplate,
                      content: e.target.value
                    })}
                    rows={10}
                    className="w-full p-2 border rounded font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Variables de Test</label>
                  {Array.isArray(selectedTemplate.variables) && selectedTemplate.variables.map(variable => (
                    <div key={variable} className="mb-2">
                      <label className="block text-xs text-gray-600">{variable}</label>
                      <input
                        type="text"
                        value={previewData[variable] || ''}
                        onChange={e => setPreviewData({
                          ...previewData,
                          [variable]: e.target.value
                        })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                  <button
                    onClick={() => {
                      setMessage({ 
                        type: 'info', 
                        text: 'Prévisualisation en cours de développement' 
                      });
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Prévisualiser
                  </button>
                  <button
                    onClick={() => {
                      setMessage({ 
                        type: 'info', 
                        text: 'Envoi de test en cours de développement' 
                      });
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Envoyer un test
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Prévisualisation */}
          {previewHtml && (
            <div className="bg-white p-4 rounded-lg shadow md:col-span-3">
              <h2 className="text-xl font-semibold mb-4">Prévisualisation</h2>
              <div
                className="border p-4 rounded"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          )}
        </div>
    </div>
  );
}
