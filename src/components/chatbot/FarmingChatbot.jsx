import React, { useState, useRef, useEffect } from 'react';
import { Bot, MessageCircle, X, Send, Sparkles, User, RefreshCw, Sprout, Settings2, Check, KeyRound, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateFarmAIResponse } from '../../utils/farmAIEngine';
import './FarmingChatbot.css';

const DEFAULT_WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'bot',
  text: 'Namaste! 🙏 Welcome to **Farmogram AI Assistant**.\n\nI am your 24/7 real-time agronomic advisor powered by agricultural intelligence. How can I assist your farm today?',
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  source: 'Real AI Core',
  suggestions: [
    'Bacterial leaf blight in paddy',
    'Tomato blossom end rot calcium remedy',
    'Cotton pink bollworm traps',
    'Drip irrigation & PMKSY subsidy',
    'Turmeric rhizome rot control'
  ]
};

// Formats markdown-like text (headers, bold, bullet points, numbered lists) into React elements
const FormattedMessage = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="formatted-ai-response">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
          return <div key={lineIdx} style={{ height: '6px' }} />;
        }

        // Header ###
        if (trimmed.startsWith('### ')) {
          return (
            <h5 key={lineIdx} className="ai-markdown-h5">
              {formatInlineText(trimmed.replace('### ', ''))}
            </h5>
          );
        }

        // Header ##
        if (trimmed.startsWith('## ')) {
          return (
            <h4 key={lineIdx} className="ai-markdown-h4">
              {formatInlineText(trimmed.replace('## ', ''))}
            </h4>
          );
        }

        // Bullet point (• or - or *)
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.replace(/^[•\-\*]\s+/, '');
          return (
            <div key={lineIdx} className="ai-bullet-point">
              <span className="ai-bullet-dot">▸</span>
              <span>{formatInlineText(bulletText)}</span>
            </div>
          );
        }

        // Numbered list item (1. 2. etc.)
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={lineIdx} className="ai-numbered-point">
              <span className="ai-number-badge">{numMatch[1]}</span>
              <span>{formatInlineText(numMatch[2])}</span>
            </div>
          );
        }

        // Regular paragraph line
        return (
          <p key={lineIdx} className="ai-paragraph">
            {formatInlineText(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

// Helper to format bold **text** and italic *text*
const formatInlineText = (text) => {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="ai-bold-text">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="ai-italic-text">{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

export const FarmingChatbot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([DEFAULT_WELCOME_MESSAGE]);
  const [showConfig, setShowConfig] = useState(false);

  // AI Configuration State (Supports Gemini / OpenAI / Built-in Real AI)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('farmogram_ai_apikey') || '');
  const [aiProvider, setAiProvider] = useState(() => localStorage.getItem('farmogram_ai_provider') || 'auto');
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('farmogram_ai_apikey', apiKey.trim());
    localStorage.setItem('farmogram_ai_provider', aiProvider);
    setKeySavedMessage(true);
    setTimeout(() => setKeySavedMessage(false), 2500);
    setShowConfig(false);
  };

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = Date.now().toString();

    // Append user message
    const newMessages = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        text: textToSend,
        time: currentTime
      }
    ];

    setMessages(newMessages);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      // Call the Real AI Agronomic Intelligence Engine
      const aiResult = await generateFarmAIResponse(textToSend, newMessages, {
        apiKey: apiKey.trim(),
        provider: aiProvider,
        userProfile: user
      });

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: aiResult.reply,
          source: aiResult.source || 'Real AI Core',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestions: aiResult.suggestions || []
        }
      ]);
    } catch (error) {
      console.error('AI response error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `🌾 **Farm AI Assistant — Technical Note:**\n\nI encountered an unexpected connection latency. Please verify your query or retry. You can ask directly about **Paddy Blight, Tomato Calcium, Cotton Pink Bollworm, or Drip Subsidies**.`,
          source: 'System Fallback',
          time: currentTime,
          suggestions: DEFAULT_WELCOME_MESSAGE.suggestions
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([DEFAULT_WELCOME_MESSAGE]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          className="farming-chatbot-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open Farm AI Assistant"
          title="Ask Real Farm AI Assistant"
        >
          <div className="launcher-icon-wrapper">
            <span className="launcher-pulse-ring" />
            <Bot size={22} />
            <span className="launcher-badge">AI</span>
          </div>
          <span>Farm AI Assistant</span>
        </button>
      )}

      {/* Floating Chatbot Window Modal */}
      {isOpen && (
        <div className="farming-chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <Sprout size={20} />
              </div>
              <div className="chatbot-title-container">
                <h4>Farm AI Assistant <Sparkles size={14} style={{ color: '#f59e0b' }} /></h4>
                <div className="chatbot-status">
                  <span className="status-dot" />
                  <span>Real AI • 24/7 Smart Agronomist</span>
                </div>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button
                className={`header-action-btn ${showConfig ? 'active' : ''}`}
                onClick={() => setShowConfig(prev => !prev)}
                title="AI Engine & API Settings"
              >
                <Settings2 size={16} />
              </button>
              <button
                className="header-action-btn"
                onClick={handleResetChat}
                title="Reset Conversation"
              >
                <RefreshCw size={15} />
              </button>
              <button
                className="header-action-btn"
                onClick={() => setIsOpen(false)}
                title="Close Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* AI Settings Drawer / Panel */}
          {showConfig && (
            <div className="ai-settings-panel">
              <div className="ai-settings-title">
                <Cpu size={16} color="#16a34a" /> <strong>Real AI Engine Settings</strong>
              </div>
              <p className="ai-settings-desc">
                Farm AI Assistant runs our deep TNAU / ICAR Real Agronomic AI Engine out of the box. You can also connect external Google Gemini or OpenAI LLMs:
              </p>
              <form onSubmit={handleSaveApiKey}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    AI Provider:
                  </label>
                  <select 
                    value={aiProvider} 
                    onChange={(e) => setAiProvider(e.target.value)}
                    className="ai-settings-select"
                  >
                    <option value="auto">✨ Real Agronomic AI Core (Built-in)</option>
                    <option value="gemini">Google Gemini 1.5 Flash API</option>
                    <option value="openai">OpenAI GPT-4o-mini API</option>
                  </select>
                </div>

                {aiProvider !== 'auto' && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      API Key:
                    </label>
                    <input 
                      type="password"
                      placeholder={aiProvider === 'gemini' ? 'Paste AIza... key' : 'Paste sk-... key'}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="ai-settings-input"
                    />
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                    {keySavedMessage ? '✓ Settings Saved!' : 'Active: Real AI Enabled'}
                  </span>
                  <button type="submit" className="btn btn-sm btn-primary" style={{ padding: '4px 12px', fontSize: '0.78rem' }}>
                    Save & Close
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Messages Feed */}
          <div className="chatbot-messages-area">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
                <div className="message-icon">
                  {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="message-content-wrapper">
                  <div className="message-bubble">
                    {msg.sender === 'bot' ? (
                      <FormattedMessage text={msg.text} />
                    ) : (
                      msg.text
                    )}
                  </div>

                  {/* AI Source Tag */}
                  {msg.source && (
                    <div className="ai-source-badge">
                      <Sparkles size={11} color="#16a34a" /> {msg.source}
                    </div>
                  )}

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="suggestion-chips-container">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="suggestion-chip"
                          onClick={() => handleSendMessage(suggestion)}
                          disabled={isLoading}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Typing Animation */}
            {isLoading && (
              <div className="chat-message-row bot">
                <div className="message-icon">
                  <Bot size={16} />
                </div>
                <div className="typing-indicator-box">
                  <span className="ai-thinking-text">Real AI Agronomist is analyzing...</span>
                  <div className="typing-indicator">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="chatbot-input-area">
            <div className="chatbot-input-wrapper">
              <input
                type="text"
                className="chatbot-input"
                placeholder="Ask real AI anything (crops, leaf pests, fertilizer doses...)"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
            </div>
            <button
              className="chatbot-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              title="Send Message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
