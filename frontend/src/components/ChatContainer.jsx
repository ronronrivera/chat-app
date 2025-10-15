
import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceholder from './NoChatHistory';

const ChatContainer = () => {
  const { selectedUser, getMessagesByUserId, messages } = useChatStore(); 
  const { authUser } = useAuthStore();
  
  useEffect(() => {
    if (selectedUser) {
      getMessagesByUserId(selectedUser._id);
    }
  }, [selectedUser, getMessagesByUserId]);

  return (
    <>
      <ChatHeader/>
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map(msg => (
              <div key={msg._id} className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
                <div className={`chat-bubble relative ${msg.senderId === authUser._id ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"}`}>
                  {msg.image && <img src={msg.image} alt="shared" className="rounded-lg h-48 object-cover" />}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          selectedUser && <NoChatHistoryPlaceholder name={selectedUser.fullname} />
        )}
      </div>
    </>
  );
};

export default ChatContainer;
