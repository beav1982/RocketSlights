import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PreGameChat = ({ 
  messages, 
  currentUser, 
  onSendMessage, 
  isExpanded = false, 
  onToggleExpanded 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isExpanded, messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      userId: currentUser.id,
      username: currentUser.displayName,
      avatar: currentUser.avatar,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    onSendMessage?.(message);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const unreadCount = messages.filter(msg => 
    msg.userId !== currentUser.id && !msg.read
  ).length;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
      {/* Chat Header */}
      <button
        onClick={onToggleExpanded}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="MessageCircle" size={16} className="text-secondary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-foreground">Pre-Game Chat</h3>
            <p className="text-sm text-muted-foreground">
              {messages.length} messages
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <div className="bg-secondary text-secondary-foreground text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-2 font-medium">
              {unreadCount}
            </div>
          )}
          <Icon 
            name={isExpanded ? "ChevronDown" : "ChevronUp"} 
            size={20} 
            className="text-muted-foreground" 
          />
        </div>
      </button>

      {/* Chat Content */}
      {isExpanded && (
        <div className="border-t border-border">
          {/* Messages Area */}
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="MessageCircle" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  No messages yet. Start the conversation!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex space-x-3 ${
                    message.userId === currentUser.id ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    {message.avatar ? (
                      <Image
                        src={message.avatar}
                        alt={`${message.username}'s avatar`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {message.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 max-w-xs ${
                    message.userId === currentUser.id ? 'text-right' : 'text-left'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      {message.userId !== currentUser.id && (
                        <span className="text-xs font-medium text-foreground">
                          {message.username}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    
                    <div className={`
                      inline-block px-3 py-2 rounded-lg text-sm
                      ${message.userId === currentUser.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                      }
                    `}>
                      {message.content}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Indicator */}
          {isTyping && (
            <div className="px-4 py-2 border-t border-border/50">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-typing-dots" />
                  <div className="w-2 h-2 bg-current rounded-full animate-typing-dots" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-typing-dots" style={{ animationDelay: '0.4s' }} />
                </div>
                <span className="text-xs">Someone is typing...</span>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-0 bg-muted/50 focus:bg-muted"
                />
              </div>
              <Button
                type="submit"
                variant="default"
                size="icon"
                disabled={!newMessage.trim()}
                iconName="Send"
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreGameChat;