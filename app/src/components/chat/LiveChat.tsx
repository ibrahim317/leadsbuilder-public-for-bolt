import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { MessageSquare, X, MinusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ChatRoom, ChatMessage } from '../../db';
import { ChatRoom as ChatRoomType, ChatMessage as ChatMessageType } from '../../db/types';

export function LiveChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [room, setRoom] = useState<ChatRoomType | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      initializeChat();
    }
  }, [user]);

  useEffect(() => {
    if (room) {
      // Use the subscribeToChatRoom function from our ChatRoom module
      const unsubscribe = ChatRoom.subscribeToChatRoom(
        room.id,
        undefined, // We don't need room updates in this component
        (newMessage) => {
          setMessages(current => [...current, newMessage]);
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [room]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    if (!user?.id) return;
    
    try {
      // Use the getActiveRoom function from our ChatRoom module
      const { data: activeRoom, error: roomError } = await ChatRoom.getActiveRoom(user.id);

      if (roomError) throw roomError;

      if (activeRoom) {
        setRoom(activeRoom);
        // Use the getRoomMessages function from our ChatMessage module
        const { data: existingMessages, error: messagesError } = await ChatMessage.getRoomMessages(
          activeRoom.id,
          50, // Limit to 50 messages
          1   // First page
        );

        if (messagesError) throw messagesError;
        setMessages(existingMessages || []);
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du chat:', error);
      toast.error('Impossible d\'initialiser le chat');
    }
  };

  const startNewChat = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      // Use the createChatRoom function from our ChatRoom module
      const { data: newRoom, error: roomError } = await ChatRoom.createChatRoom({
        userId: user.id,
        title: 'Support Chat'
      });

      if (roomError) throw roomError;
      if (!newRoom) throw new Error('Failed to create chat room');

      setRoom(newRoom);
      setIsOpen(true);
      setIsMinimized(false);
    } catch (error) {
      console.error('Erreur lors de la création du chat:', error);
      toast.error('Impossible de démarrer le chat');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !newMessage.trim() || !user?.id) return;

    try {
      // Use the sendMessage function from our ChatMessage module
      const { error } = await ChatMessage.sendMessage({
        roomId: room.id,
        userId: user.id,
        content: newMessage // This will be mapped to message in the database
      });

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error('Impossible d\'envoyer le message');
    }
  };

  const closeChat = async () => {
    if (!room) return;

    try {
      // Use the closeChat function from our ChatRoom module
      const { error } = await ChatRoom.closeChat(room.id);

      if (error) throw error;

      setRoom(null);
      setMessages([]);
      setIsOpen(false);
    } catch (error) {
      console.error('Erreur lors de la fermeture du chat:', error);
      toast.error('Impossible de fermer le chat');
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={startNewChat}
          disabled={loading}
          className="rounded-full p-3 h-12 w-12 flex items-center justify-center"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      ) : (
        <div className={`bg-white rounded-lg shadow-lg ${
          isMinimized ? 'h-12' : 'h-[500px]'
        } w-[350px] flex flex-col transition-all duration-200`}>
          <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Chat Support</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:text-blue-100"
              >
                <MinusCircle className="h-5 w-5" />
              </button>
              <button
                onClick={closeChat}
                className="text-white hover:text-blue-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.user_id === user.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`max-w-[75%] rounded-lg p-3 ${
                      message.user_id === user.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {message.created_at ? new Date(message.created_at).toLocaleTimeString() : ''}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Votre message..."
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    Envoyer
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
