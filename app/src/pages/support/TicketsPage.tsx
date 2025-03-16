import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import toast from "react-hot-toast";
import UserLayout from "../../layouts/UserLayout";
import { Ticket as TicketModule, TicketMessage as TicketMessageModule } from "../../db";
import { Ticket, TicketMessage } from "../../db/types";

// Define a local interface that matches what we're expecting from the API
interface TicketWithMessages extends Ticket {
  messages?: TicketMessage[];
}

export default function TicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<TicketWithMessages[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketWithMessages | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "general",
    priority: "medium",
    message: "",
  });
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  // Load tickets
  useEffect(() => {
    loadTickets();
  }, [user]);

  const loadTickets = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await TicketModule.getTicketsByUserId(user.id);
    
    if (error) {
      toast.error("Impossible de charger les tickets");
      console.error("Erreur lors du chargement des tickets:", error);
    } else {
      setTickets(data as TicketWithMessages[]);
    }
    
    setLoading(false);
  };

  // Refresh the selected ticket to get the latest messages
  const refreshSelectedTicket = async () => {
    if (!selectedTicket) return;
    
    const { data, error } = await TicketModule.getTicketById(selectedTicket.id);
    if (error) {
      console.error("Error refreshing ticket:", error);
      return;
    }
    
    if (data) {
      setSelectedTicket(data as TicketWithMessages);
      
      // Also update the ticket in the tickets list
      setTickets(prev => 
        prev.map(t => t.id === data.id ? data as TicketWithMessages : t)
      );
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data: ticket, error } = await TicketModule.createTicketWithMessage(
        newTicket.subject,
        newTicket.category,
        newTicket.priority,
        newTicket.message,
        user.id
      );

      if (error) throw error;

      toast.success("Ticket créé avec succès");
      setShowNewTicketForm(false);
      setNewTicket({
        subject: "",
        category: "general",
        priority: "medium",
        message: "",
      });
      loadTickets();
    } catch (error) {
      console.error("Erreur lors de la création du ticket:", error);
      toast.error("Impossible de créer le ticket");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim() || !user) return;

    try {
      const { error } = await TicketMessageModule.createTicketMessage(
        selectedTicket.id,
        newMessage,
        user.id
      );

      if (error) throw error;

      setNewMessage("");
      // Instead of reloading all tickets, just refresh the selected ticket
      await refreshSelectedTicket();
      toast.success("Message envoyé");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Impossible d'envoyer le message");
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
      <UserLayout>
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Support</h1>
            <Button
              onClick={() => setShowNewTicketForm(true)}
              disabled={showNewTicketForm}
            >
              Nouveau Ticket
            </Button>
          </div>

          {showNewTicketForm && (
            <form
              onSubmit={handleCreateTicket}
              className="mb-8 space-y-4 bg-white p-6 rounded-lg shadow"
            >
              <h2 className="text-xl font-semibold mb-4">
                Créer un nouveau ticket
              </h2>

              <div>
                <label className="block text-sm font-medium mb-1">Sujet</label>
                <Input
                  value={newTicket.subject}
                  onChange={(e) =>
                    setNewTicket((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Catégorie
                </label>
                <Select
                  value={newTicket.category}
                  onChange={(e) =>
                    setNewTicket((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  <option value="general">Général</option>
                  <option value="technical">Technique</option>
                  <option value="billing">Facturation</option>
                  <option value="feature">Fonctionnalité</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Priorité
                </label>
                <Select
                  value={newTicket.priority}
                  onChange={(e) =>
                    setNewTicket((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>
                <Textarea
                  value={newTicket.message}
                  onChange={(e) =>
                    setNewTicket((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  required
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewTicketForm(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Créer le ticket</Button>
              </div>
            </form>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4">Mes tickets</h2>
              <div className="space-y-2">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`p-4 rounded cursor-pointer transition-colors ${
                      selectedTicket?.id === ticket.id
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-gray-50 border-gray-200"
                    } border`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{ticket.subject}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(ticket.created_at || '').toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            ticket.status === "open"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {ticket.status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            ticket.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : ticket.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedTicket && (
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-semibold mb-4">
                  {selectedTicket.subject}
                </h2>
                <div className="space-y-4 mb-4 max-h-[500px] overflow-y-auto">
                  {selectedTicket.messages?.map((message: TicketMessage) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded ${
                        message.is_staff ? "bg-blue-50 ml-4" : "bg-gray-50 mr-4"
                      }`}
                    >
                      <p className="text-sm text-gray-500 mb-1">
                        {message.is_staff ? "Support" : "Vous"} -{" "}
                        {new Date(message.created_at || '').toLocaleString()}
                      </p>
                      <p>{message.message}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Votre message..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    Envoyer
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </UserLayout>
  );
}
