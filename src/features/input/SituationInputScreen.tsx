import React, { useState } from 'react';
import { Emotion, EMOTIONS, Situation } from '@/shared/types';

interface SituationInputScreenProps {
  onStartSimulation: (situation: Omit<Situation, 'id' | 'date'>) => void;
  onBack: () => void;
}

const SituationInputScreen: React.FC<SituationInputScreenProps> = ({ onStartSimulation, onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    whatHappened: '',
    emotions: [] as Emotion[],
    emotionIntensity: 5,
    whatYouDid: '',
    howYouWishItHadGone: '',
    personaName: '',
    personaTone: '',
    personaPersonality: '',
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleEmotionToggle = (emotion: Emotion) => {
    setFormData(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotion) ? [] : [emotion],
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.whatHappened.trim().length > 5;
      case 2: return formData.emotions.length > 0;
      case 3: return formData.whatYouDid.trim().length > 5;
      case 4: return formData.howYouWishItHadGone.trim().length > 5;
      case 5: return formData.personaName.trim().length > 0 && formData.personaTone.trim().length > 0 && formData.personaPersonality.trim().length > 0;
      default: return false;
    }
  };

  const handleSubmit = () => {
    if (isStepValid()) {
      onStartSimulation(formData);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in">
            <label className="text-xl font-bold text-slate-800 block mb-2">무슨 일이 있었나요?</label>
            <p className="text-slate-500 mb-6">회고하고 싶은 상황을 간략하게 설명해주세요.</p>
            <textarea
              value={formData.whatHappened}
              onChange={(e) => setFormData({ ...formData, whatHappened: e.target.value })}
              className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all shadow-sm resize-none text-lg"
              rows={6}
              placeholder="예: 주말 계획에 대해 친구와 의견 충돌이 있었어요."
            />
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <label className="text-xl font-bold text-slate-800 block mb-2">어떤 감정을 느꼈나요?</label>
            <p className="text-slate-500 mb-6">가장 크게 느껴지는 감정 하나를 선택하세요.</p>
            <div className="flex flex-wrap gap-2.5 mb-10">
              {EMOTIONS.map(emotion => (
                <button
                  key={emotion}
                  onClick={() => handleEmotionToggle(emotion)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 active:scale-95 ${formData.emotions.includes(emotion)
                    ? 'bg-primary-700 text-white shadow-lg shadow-primary-500/30 ring-2 ring-primary-700 ring-offset-2'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50'
                    }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
            <label className="text-xl font-bold text-slate-800 block mb-2">가장 강한 감정의 강도는 어땠나요?</label>
            <p className="text-slate-500 mb-6">1부터 10까지의 척도로 알려주세요.</p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-6">
                <span className="text-3xl grayscale opacity-50">😐</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.emotionIntensity}
                  onChange={(e) => setFormData({ ...formData, emotionIntensity: parseInt(e.target.value, 10) })}
                  className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-600 hover:accent-primary-700"
                />
                <span className="text-3xl">😡</span>
              </div>
              <div className="text-center mt-4">
                <span className="text-4xl font-black text-primary-600">{formData.emotionIntensity}</span>
                <span className="text-slate-400 text-sm ml-1">/ 10</span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <label className="text-xl font-bold text-slate-800 block mb-2">당신은 무엇을 했거나, 하지 못했나요?</label>
            <p className="text-slate-500 mb-6">그 순간 당신의 반응을 설명해주세요.</p>
            <textarea
              value={formData.whatYouDid}
              onChange={(e) => setFormData({ ...formData, whatYouDid: e.target.value })}
              className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all shadow-sm resize-none text-lg"
              rows={6}
              placeholder="예: 저는 입을 닫고 정말 하고 싶었던 말을 하지 못했어요."
            />
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in">
            <label className="text-xl font-bold text-slate-800 block mb-2">어떻게 되길 바랐나요?</label>
            <p className="text-slate-500 mb-6">이상적인 결과는 어떤 모습이었을까요?</p>
            <textarea
              value={formData.howYouWishItHadGone}
              onChange={(e) => setFormData({ ...formData, howYouWishItHadGone: e.target.value })}
              className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all shadow-sm resize-none text-lg"
              rows={6}
              placeholder="예: 제 관점을 차분하게 설명했으면 좋았을 거예요."
            />
          </div>
        );
      case 5:
        return (
          <div className="animate-fade-in">
            <label className="text-xl font-bold text-slate-800 block mb-2">누구와 대화하고 있나요?</label>
            <p className="text-slate-500 mb-6">AI 시뮬레이션을 위해 상대방을 묘사해주세요.</p>
            <div className="space-y-4">
              <input
                type="text"
                value={formData.personaName}
                onChange={(e) => setFormData({ ...formData, personaName: e.target.value })}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all shadow-sm"
                placeholder="상대방의 이름 (예: 알렉스)"
              />
              <input
                type="text"
                value={formData.personaTone}
                onChange={(e) => setFormData({ ...formData, personaTone: e.target.value })}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all shadow-sm"
                placeholder="상대방의 말투 (예: 차분함, 방어적, 쾌활함)"
              />
              <textarea
                value={formData.personaPersonality}
                onChange={(e) => setFormData({ ...formData, personaPersonality: e.target.value })}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all shadow-sm resize-none"
                rows={3}
                placeholder="상대방의 성격 (예: 논리적이고 직설적, 공감적이지만 불안해함)"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 max-w-2xl mx-auto border border-white/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900">새로운 회고</h2>
        <span className="text-sm font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">Step {step} / 5</span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2 mb-10 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>

      <div className="min-h-[360px]">
        {renderStep()}
      </div>

      <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
        <button
          onClick={step === 1 ? onBack : handleBack}
          className="text-slate-500 font-bold py-3 px-6 rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-colors"
        >
          {step === 1 ? '취소' : '이전 단계'}
        </button>
        {step < 5 ? (
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="bg-primary-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-800 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed disabled:translate-y-0"
          >
            다음 단계
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isStepValid()}
            className="bg-gradient-to-r from-primary-700 to-secondary-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all disabled:bg-none disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed disabled:translate-y-0"
          >
            시뮬레이션 시작
          </button>
        )}
      </div>
    </div>
  );
};

export default SituationInputScreen;
