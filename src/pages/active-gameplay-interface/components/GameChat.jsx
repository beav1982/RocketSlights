import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const GameChat = ({ 
  messages = [], 
  currentPlayer = null,
  onSendMessage = () => {},
  isOpen = false,
  onToggle = () => {},
  className = '' 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    
    try {
      await onSendMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        iconName="MessageCircle"
        iconPosition="left"
        className={`fixed bottom-20 right-4 z-50 bg-card/95 backdrop-blur-sm ${className}`}
      >
        Chat
        {messages.length > 0 && (
          <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {messages.length > 99 ? '99+' : messages.length}
          </span>
        )}
      </Button>
    );
  }

  return (
    <div className={`
      fixed bottom-20 right-4 z-50 bg-card border border-border rounded-xl 
      shadow-game-modal backdrop-blur-sm w-80 max-w-[calc(100vw-2rem)] h-96
      flex flex-col
      ${className}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="MessageCircle" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Game Chat
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          iconName="X"
          className="p-1"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Icon name="MessageCircle" size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === currentPlayer?.id;
            const isSystemMessage = message.type === 'system';
            
            if (isSystemMessage) {
              return (
                <div key={message.id} className="text-center">
                  <div className="inline-block bg-muted/50 text-muted-foreground text-xs px-3 py-1 rounded-full">
                    {message.text}
                  </div>
                </div>
              );
            }
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[80%] rounded-lg p-3
                  ${isOwnMessage 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-foreground'
                  }
                `}>
                  {!isOwnMessage && (
                    <div className="text-xs font-medium mb-1 opacity-80">
                      {message.senderName}
                    </div>
                  )}
                  <div className="text-sm leading-relaxed">
                    {message.text}
                  </div>
                  <div className={`
                    text-xs mt-1 opacity-70
                    ${isOwnMessage ? 'text-right' : 'text-left'}
                  `}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            variant="default"
            size="default"
            disabled={!newMessage.trim() || isLoading}
            loading={isLoading}
            iconName="Send"
            className="px-3"
          />
        </form>
      </div>
    </div>
  );
};

export default GameChat;