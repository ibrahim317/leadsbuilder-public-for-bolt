import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { toast } from 'react-hot-toast';
import { supabaseClient } from '../../lib/supabaseClient';
import { Monitoring, ErrorLog } from '../../db';

interface Alert {
  id: string;
  name: string;
  description: string;
  condition_type: string;
  threshold: number;
  metric_name: string;
  severity: string;
  enabled: boolean;
}

interface MetricData {
  timestamp: string;
  value: number;
}

export default function MonitoringPage() {
  const [activeTab, setActiveTab] = useState<'alerts' | 'errors' | 'metrics' | 'dashboard'>('dashboard');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [metrics, setMetrics] = useState<Record<string, MetricData[]>>({});
  const [newAlert, setNewAlert] = useState({
    name: '',
    description: '',
    condition_type: 'threshold',
    threshold: 0,
    metric_name: '',
    severity: 'medium'
  });

  useEffect(() => {
    loadAlerts();
    loadErrors();
    loadMetrics();
  }, []);

  const loadAlerts = async () => {
    const { data, error } = await supabaseClient
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Erreur lors du chargement des alertes');
      return;
    }
    
    setAlerts(data || []);
  };

  const loadErrors = async () => {
    const { data, error } = await Monitoring.getErrors(100);
    
    if (error) {
      toast.error('Erreur lors du chargement des erreurs');
      return;
    }
    
    setErrors(data || []);
  };

  const loadMetrics = async () => {
    const { data, error } = await Monitoring.getMetrics(100);
    
    if (error) {
      toast.error('Erreur lors du chargement des métriques');
      return;
    }
    
    // Group metrics by name using the utility function
    const groupedMetrics = Monitoring.formatMetricsForCharts(data);
    setMetrics(groupedMetrics);
  };

  const createAlert = async () => {
    const { error } = await supabaseClient
      .from('alerts')
      .insert([newAlert]);
    
    if (error) {
      toast.error('Erreur lors de la création de l\'alerte');
      return;
    }
    
    toast.success('Alerte créée avec succès');
    loadAlerts();
    setNewAlert({
      name: '',
      description: '',
      condition_type: 'threshold',
      threshold: 0,
      metric_name: '',
      severity: 'medium'
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex space-x-4">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'alerts' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('alerts')}
          >
            Alertes
          </Button>
          <Button
            variant={activeTab === 'errors' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('errors')}
          >
            Erreurs
          </Button>
          <Button
            variant={activeTab === 'metrics' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('metrics')}
          >
            Métriques
          </Button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Vue d'ensemble</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(metrics).map(([metricName, data]) => (
              <div key={metricName} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">{metricName}</h3>
                <LineChart width={500} height={300} data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Créer une alerte</h3>
            <div className="space-y-4">
              <Input
                placeholder="Nom de l'alerte"
                value={newAlert.name}
                onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
              />
              <Input
                placeholder="Description"
                value={newAlert.description}
                onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
              />
              <Select
                value={newAlert.condition_type}
                onChange={(e) => setNewAlert({ ...newAlert, condition_type: e.target.value })}
              >
                <option value="threshold">Seuil</option>
                <option value="trend">Tendance</option>
              </Select>
              <Input
                type="number"
                placeholder="Seuil"
                value={newAlert.threshold}
                onChange={(e) => setNewAlert({ ...newAlert, threshold: Number(e.target.value) })}
              />
              <Input
                placeholder="Nom de la métrique"
                value={newAlert.metric_name}
                onChange={(e) => setNewAlert({ ...newAlert, metric_name: e.target.value })}
              />
              <Select
                value={newAlert.severity}
                onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
              >
                <option value="low">Basse</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
                <option value="critical">Critique</option>
              </Select>
              <Button onClick={createAlert}>Créer l'alerte</Button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Alertes existantes</h3>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="border p-4 rounded-lg"
                >
                  <h4 className="font-medium">{alert.name}</h4>
                  <p className="text-sm text-gray-600">{alert.description}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      alert.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {alert.enabled ? 'Activée' : 'Désactivée'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'errors' && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Logs d'erreurs</h3>
          <div className="space-y-4">
            {errors.map((error: any) => (
              <div
                key={error.id}
                className="border p-4 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{error.message}</h4>
                  <span className={`px-2 py-1 rounded text-sm ${
                    error.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    error.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    error.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {error.severity || 'low'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{error.message}</p>
                {error.stack_trace && (
                  <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                    {error.stack_trace}
                  </pre>
                )}
                <div className="mt-2 text-sm text-gray-500">
                  {new Date(error.created_at).toLocaleString()}
                </div>
                {!error.resolved && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      Monitoring.markErrorAsResolved(error.id)
                        .then(({ success, error }) => {
                          if (success) {
                            toast.success('Erreur marquée comme résolue');
                            loadErrors();
                          } else if (error) {
                            toast.error('Erreur lors de la résolution');
                          }
                        });
                    }}
                  >
                    Marquer comme résolu
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'metrics' && (
        <div className="space-y-6">
          {Object.entries(metrics).map(([metricName, data]) => (
            <div key={metricName} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">{metricName}</h3>
              <LineChart width={800} height={400} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
