import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import type { FollowUpProfile, MessageType } from '../types/followup';
import { format } from 'date-fns';

interface DateColumnProps {
  date: Date;
  profile: FollowUpProfile;
  onMessageAdd: (profileId: number, type: MessageType, date: Date) => Promise<void>;
}

const MESSAGE_TYPES: { value: MessageType; label: string; color: string }[] = [
  { value: '1er_message', label: '1er message', color: 'bg-blue-100 text-blue-600' },
  { value: '1er_followup', label: '1er follow-up', color: 'bg-orange-100 text-orange-600' },
  { value: '2eme_followup', label: '2ème follow-up', color: 'bg-orange-100 text-orange-600' },
  { value: '3eme_followup', label: '3ème follow-up', color: 'bg-orange-100 text-orange-600' },
  { value: '4eme_followup', label: '4ème follow-up', color: 'bg-orange-100 text-orange-600' },
  { value: '5eme_followup', label: '5ème follow-up', color: 'bg-orange-100 text-orange-600' },
  { value: 'rdv', label: 'RDV', color: 'bg-green-100 text-green-600' },
  { value: 'pas_interesse', label: 'Pas intéressé', color: 'bg-red-100 text-red-600' }
];

export default function DateColumn({ date, profile, onMessageAdd }: DateColumnProps) {
  const [isOpen, setIsOpen] = useState(false);
  const formattedDate = format(date, 'dd/MM');
  
  const messageForDate = profile.messages.find(
    m => format(new Date(m.sent_at), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  const handleMessageSelect = async (type: MessageType) => {
    await onMessageAdd(profile.id, type, date);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-24 h-12 flex items-center justify-center text-sm border-r border-b border-gray-200 hover:bg-gray-50 ${
          messageForDate ? MESSAGE_TYPES.find(t => t.value === messageForDate.type)?.color : ''
        }`}
      >
        {messageForDate ? (
          <span className="truncate px-2">
            {MESSAGE_TYPES.find(t => t.value === messageForDate.type)?.label}
          </span>
        ) : (
          <MessageCircle className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="p-2 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-900">{formattedDate}</div>
          </div>
          <div className="p-1">
            {MESSAGE_TYPES.map(type => (
              <button
                key={type.value}
                onClick={() => handleMessageSelect(type.value)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 ${type.color}`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}