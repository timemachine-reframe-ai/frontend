import React, { useState, useEffect, useRef } from 'react';
import { Reflection, Message } from '../types';
import { Chat, GenerateContentResponse } from '@google/genai';

interface SimulationScreenProps {
  reflection: Reflection;
  chat: Chat;
  onEndSimulation: (conversation: Message[]) => void;
}

const SimulationScreen: React.FC<SimulationScreenProps> = ({ reflection, chat, onEndSimulation }) => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [maxTurns, setMaxTurns] = useState(10);
  const [showExtendPopup, setShowExtendPopup] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userTurns = conversation.filter(msg => msg.sender === 'user').length;
  const turnsLeft = maxTurns - userTurns;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || showExtendPopup) return;
    
    if (userTurns >= maxTurns) {
      setShowExtendPopup(true);
      return;
    }

    const userMessage: Message = { sender: 'user', text: userInput };
    setConversation(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response: GenerateContentResponse = await chat.sendMessage({ message: userMessage.text });
      const aiMessage: Message = { sender: 'ai', text: response.text };
      setConversation(prev => {
        const newConversation = [...prev, aiMessage];
        const newUserTurns = newConversation.filter(msg => msg.sender === 'user').length;
        if (newUserTurns >= maxTurns) {
          setShowExtendPopup(true);
        }
        return newConversation;
      });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = { sender: 'ai', text: "죄송합니다, 메시지를 처리하는 중 오류가 발생했습니다." };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtend = () => {
    setMaxTurns(prev => prev + 5);
    setShowExtendPopup(false);
  }

  return (
    <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg animate-fade-in max-w-4xl mx-auto flex flex-col h-[90vh] relative">
      <div className="text-center mb-4 border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">대화 시뮬레이션</h2>
        <p className="text-slate-500">
          <span className="font-semibold text-violet-600">{reflection.personaName}</span>
          와(과)의 대화
        </p>
         <p className="text-sm text-slate-500 mt-1">남은 턴: <span className="font-bold text-violet-600">{turnsLeft > 0 ? turnsLeft : 0}</span></p>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-4 -mr-4 mb-4">
        <div className="space-y-4">
          {conversation.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && <div title={reflection.personaName} className="w-8 h-8 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center font-bold text-sm flex-shrink-0">{reflection.personaName.charAt(0)}</div>}
              <div
                className={`max-w-lg md:max-w-2xl p-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-violet-500 text-white rounded-br-none'
                    : 'bg-slate-200 text-slate-800 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex items-end gap-2 justify-start">
               <div title={reflection.personaName} className="w-8 h-8 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center font-bold text-sm flex-shrink-0">{reflection.personaName.charAt(0)}</div>
               <div className="max-w-md p-3 rounded-2xl bg-slate-200 text-slate-800 rounded-bl-none">
                 <div className="flex items-center gap-1">
                   <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                   <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                   <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center gap-3 border-t pt-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={turnsLeft > 0 ? "메시지를 입력하세요..." : "대화 턴을 모두 사용했습니다."}
          disabled={isLoading || turnsLeft <= 0}
          className="flex-1 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-400 disabled:bg-slate-100"
        />
        <button
          type="submit"
          disabled={isLoading || !userInput.trim() || turnsLeft <= 0}
          className="bg-violet-500 text-white font-bold py-3 px-6 rounded-xl shadow hover:bg-violet-600 transition disabled:bg-slate-300"
        >
          전송
        </button>
      </form>
      <button
        onClick={() => onEndSimulation(conversation)}
        className="mt-3 w-full text-red-500 font-semibold py-2 hover:text-red-700 transition"
      >
        시뮬레이션 종료 및 리포트 생성
      </button>

      {showExtendPopup && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm">
                <h3 className="text-xl font-bold text-slate-800">대화를 연장하시겠습니까?</h3>
                <p className="text-slate-600 mt-2 mb-6">대화 턴을 모두 사용했습니다. 5턴을 더 연장하여 대화를 계속할 수 있습니다.</p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleExtend}
                        className="w-full bg-violet-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-600 transition"
                    >
                        5턴 연장하기
                    </button>
                    <button 
                        onClick={() => onEndSimulation(conversation)}
                        className="w-full bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-300 transition"
                    >
                        종료 및 리포트 생성
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SimulationScreen;