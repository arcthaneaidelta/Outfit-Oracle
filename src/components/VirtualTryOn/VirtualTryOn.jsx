import React, { useState, useRef, useEffect } from 'react';
import WardrobeSelector from './WardrobeSelector';
import { useToast } from '../shared/ToastContext';
import { chatWithGemini, getAIImageUrl } from '../../utils/geminiApi';

export default function VirtualTryOn({ wardrobe, saveOutfit }) {
  const { addToast } = useToast();
  const chatEndRef = useRef(null);
  
  // Selection State
  const [selectedItems, setSelectedItems] = useState({ top: null, bottom: null, shoes: null });
  const [processedImages, setProcessedImages] = useState({ top: null, bottom: null, shoes: null });

  // Chat State
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am your Gemini AI Stylist. Select some clothes and tell me how you want to see them (e.g., \"Show this on a slim guy with light skin tone\").' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectItem = async (category, item) => {
    let slot = category.toLowerCase();
    if (slot === 'pants' || slot === 'bottoms') slot = 'bottom';
    if (slot === 'shirts' || slot === 'tops') slot = 'top';

    if (selectedItems[slot]?.id === item.id) {
      setSelectedItems(prev => ({ ...prev, [slot]: null }));
      setProcessedImages(prev => ({ ...prev, [slot]: null }));
      return;
    }

    setSelectedItems(prev => ({ ...prev, [slot]: item }));
    
    if (item.imageUrl) {
      setProcessedImages(prev => ({ ...prev, [slot]: item.imageUrl }));
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || isAILoading) return;

    const currentInput = userInput;
    setUserInput('');
    setMessages(prev => [...prev, { role: 'user', text: currentInput }]);
    setIsAILoading(true);

    try {
      const response = await chatWithGemini(currentInput, selectedItems, processedImages);
      
      setMessages(prev => [...prev, { role: 'assistant', text: response.aiResponse }]);
      
      if (response.imagePrompt) {
        const imageUrl = getAIImageUrl(response.imagePrompt);
        setGeneratedImage(imageUrl);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          text: 'Generating your custom visual look...',
          isImageLoader: true 
        }]);
      }
    } catch (err) {
      addToast(err.message || "AI Stylist is temporarily unavailable.", "error");
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <div className="vto-gemini-layout">
      {/* LEFT: Wardrobe & Selection */}
      <div className="vto-wardrobe-side glass-panel">
        <h3 className="vto-title">Selected Look</h3>
        <div className="selected-preview-row">
          {Object.entries(processedImages).map(([cat, url]) => (
            <div key={cat} className="mini-preview">
              {url ? <img src={url} alt={cat} /> : <div className="empty-mini">{cat}</div>}
            </div>
          ))}
        </div>
        <WardrobeSelector wardrobe={wardrobe} selectedItems={selectedItems} onSelectItem={handleSelectItem} />
      </div>

      {/* CENTER: AI Visualizer */}
      <div className="vto-visualizer-side">
        <div className="vto-result-stage glass-panel">
          {generatedImage ? (
            <div className="generated-image-container">
              <img src={generatedImage} alt="AI Generated Look" className="fade-in" />
              <button className="vto-save-btn" onClick={() => saveOutfit({ name: 'AI Look', image: generatedImage })}>
                <i className="fas fa-heart"></i> Save to Favorites
              </button>
            </div>
          ) : (
            <div className="vto-placeholder">
              <i className="fas fa-magic AI-glow"></i>
              <p>Your AI-generated preview will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Gemini Chat */}
      <div className="vto-chat-side glass-panel">
        <div className="chat-header">
          <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002.svg" alt="Gemini" width="24" />
          <span>Gemini AI Stylist</span>
        </div>
        
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role}`}>
              {msg.text}
              {msg.isImageLoader && <div className="dot-pulse"></div>}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder="Describe your look..." 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isAILoading}
          />
          <button type="submit" disabled={isAILoading}>
            {isAILoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
          </button>
        </form>
      </div>
    </div>
  );
}