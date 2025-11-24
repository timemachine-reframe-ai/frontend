import React, { useState, useEffect, useRef } from 'react';
import { Reflection, Message } from '@/shared/types';
import { requestChatReply } from '@/shared/services/geminiService';

interface SimulationScreenProps {
  reflection: Reflection;
  onEndSimulation: (conversation: Message[]) => void;
}

const SimulationScreen: React.FC<SimulationScreenProps> = ({ reflection, onEndSimulation }) => {
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
      const aiReply = await requestChatReply(reflection, conversation, userMessage.text);
      const aiMessage: Message = { sender: 'ai', text: aiReply };
      setConversation(prev => {
        const newConversation = [...prev, aiMessage];
        const newUserTurns = newConversation.filter(msg => msg.sender === 'user').length;
        if (newUserTurns >= maxTurns) {
          setShowExtendPopup(true);
        }
        return newConversation;
      });
    } catch (error: any) {
      console.error("Error sending message:", error);
      let errorText = "죄송합니다, 메시지를 처리하는 중 오류가 발생했습니다.";

      if (error.message) {
        errorText += ` (${error.message})`;
      }

      const errorMessage: Message = { sender: 'ai', text: errorText };
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
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-4 sm:p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 animate-fade-in max-w-4xl mx-auto flex flex-col h-[85vh] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-50/50 to-transparent pointer-events-none" />

      <div className="text-center mb-6 relative z-10">
        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-bold tracking-wide uppercase mb-2">
          Simulation Mode
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-1">대화 시뮬레이션</h2>
        <p className="text-slate-500 text-sm">
          <span className="font-bold text-primary-700">{reflection.personaName}</span>님과 대화하며 새로운 가능성을 탐색하세요.
        </p>

        <div className="flex items-center justify-center gap-4 mt-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary-400" />
            말투: {reflection.personaTone}
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary-400" />
            성격: {reflection.personaPersonality}
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
            <span className={`w-2 h-2 rounded-full ${turnsLeft <= 3 ? 'bg-red-400 animate-pulse' : 'bg-emerald-400'}`} />
            남은 턴: <span className="font-bold text-slate-900">{turnsLeft > 0 ? turnsLeft : 0}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 mb-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent p-2">
        {conversation.map((msg, index) => (
          <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
            {msg.sender === 'ai' && (
              <div className="flex flex-col items-center gap-1">
                <div title={reflection.personaName} className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 border border-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                  {reflection.personaName.charAt(0)}
                </div>
              </div>
            )}
            <div
              className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-sm text-base leading-relaxed ${msg.sender === 'user'
                ? 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white rounded-br-none shadow-primary-500/20'
                : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-end gap-3 justify-start animate-fade-in">
            <div title={reflection.personaName} className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 border border-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
              {reflection.personaName.charAt(0)}
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-100 text-slate-800 rounded-bl-none shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-primary-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative z-10 bg-white/50 backdrop-blur-sm p-2 rounded-3xl border border-white/50 shadow-lg">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={turnsLeft > 0 ? "메시지를 입력하세요..." : "대화 턴을 모두 사용했습니다."}
            disabled={isLoading || turnsLeft <= 0}
            className="flex-1 p-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-primary-200 placeholder:text-slate-400 text-slate-800 shadow-sm transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim() || turnsLeft <= 0}
            className="bg-primary-600 text-white font-bold p-4 rounded-2xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:scale-105 hover:shadow-primary-500/40 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed flex-shrink-0 w-14 h-14 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
      </div>

      <button
        onClick={() => onEndSimulation(conversation)}
        className="mt-4 w-full text-slate-400 text-xs font-medium py-2 hover:text-red-500 transition-colors flex items-center justify-center gap-1"
      >
        <span>시뮬레이션 종료 및 리포트 생성</span>
      </button>

      {showExtendPopup && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center animate-fade-in z-50">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 text-center max-w-sm mx-4 transform scale-100 animate-slide-up">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ✨
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">대화를 연장할까요?</h3>
            <p className="text-slate-500 mt-2 mb-8 leading-relaxed">
              준비된 턴을 모두 사용했습니다.<br />
              더 깊은 대화를 위해 5턴을 추가할 수 있습니다.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleExtend}
                className="w-full bg-primary-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:scale-[1.02] transition-all"
              >
                5턴 연장하기
              </button>
              <button
                onClick={() => onEndSimulation(conversation)}
                className="w-full bg-white text-slate-600 border border-slate-200 font-bold py-4 px-6 rounded-2xl hover:bg-slate-50 hover:text-slate-900 transition-all"
              >
                지금 종료하고 리포트 보기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationScreen;
