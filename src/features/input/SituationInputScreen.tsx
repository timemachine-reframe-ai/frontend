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
      emotions: prev.emotions.includes(emotion)
        ? prev.emotions.filter(e => e !== emotion)
        : [...prev.emotions, emotion],
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
          <div>
            <label className="text-lg font-semibold text-slate-700">무슨 일이 있었나요?</label>
            <p className="text-sm text-slate-500 mb-4">회고하고 싶은 상황을 간략하게 설명해주세요.</p>
            <textarea
              value={formData.whatHappened}
              onChange={(e) => setFormData({ ...formData, whatHappened: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition"
              rows={4}
              placeholder="예: 주말 계획에 대해 친구와 의견 충돌이 있었어요."
            />
          </div>
        );
      case 2:
        return (
          <div>
            <label className="text-lg font-semibold text-slate-700">어떤 감정을 느꼈나요?</label>
            <p className="text-sm text-slate-500 mb-4">해당되는 감정을 모두 선택하세요.</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {EMOTIONS.map(emotion => (
                <button
                  key={emotion}
                  onClick={() => handleEmotionToggle(emotion)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    formData.emotions.includes(emotion)
                      ? 'bg-violet-500 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
            <label className="text-lg font-semibold text-slate-700">가장 강한 감정의 강도는 어땠나요?</label>
            <p className="text-sm text-slate-500 mb-4">1부터 10까지의 척도로 알려주세요.</p>
            <div className="flex items-center gap-4">
              <span className="text-2xl">😐</span>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.emotionIntensity}
                onChange={(e) => setFormData({ ...formData, emotionIntensity: parseInt(e.target.value, 10) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
              <span className="text-2xl">😡</span>
            </div>
            <div className="text-center font-bold text-violet-600 mt-2 text-xl">{formData.emotionIntensity}</div>
          </div>
        );
      case 3:
        return (
          <div>
            <label className="text-lg font-semibold text-slate-700">당신은 무엇을 했거나, 하지 못했나요?</label>
            <p className="text-sm text-slate-500 mb-4">그 순간 당신의 반응을 설명해주세요.</p>
            <textarea
              value={formData.whatYouDid}
              onChange={(e) => setFormData({ ...formData, whatYouDid: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-400"
              rows={4}
              placeholder="예: 저는 입을 닫고 정말 하고 싶었던 말을 하지 못했어요."
            />
          </div>
        );
      case 4:
        return (
          <div>
            <label className="text-lg font-semibold text-slate-700">어떻게 되길 바랐나요?</label>
            <p className="text-sm text-slate-500 mb-4">이상적인 결과는 어떤 모습이었을까요?</p>
            <textarea
              value={formData.howYouWishItHadGone}
              onChange={(e) => setFormData({ ...formData, howYouWishItHadGone: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-400"
              rows={4}
              placeholder="예: 제 관점을 차분하게 설명했으면 좋았을 거예요."
            />
          </div>
        );
      case 5:
        return (
          <div>
            <label className="text-lg font-semibold text-slate-700">누구와 대화하고 있나요?</label>
            <p className="text-sm text-slate-500 mb-4">AI 시뮬레이션을 위해 상대방을 묘사해주세요.</p>
            <input
              type="text"
              value={formData.personaName}
              onChange={(e) => setFormData({ ...formData, personaName: e.target.value })}
              className="w-full p-3 mb-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-400"
              placeholder="상대방의 이름 (예: 알렉스)"
            />
            <input
              type="text"
              value={formData.personaTone}
              onChange={(e) => setFormData({ ...formData, personaTone: e.target.value })}
              className="w-full p-3 mb-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-400"
              placeholder="상대방의 말투 (예: 차분함, 방어적, 쾌활함)"
            />
            <textarea
              value={formData.personaPersonality}
              onChange={(e) => setFormData({ ...formData, personaPersonality: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-400"
              rows={2}
              placeholder="상대방의 성격 (예: 논리적이고 직설적, 공감적이지만 불안해함)"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg animate-fade-in max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-slate-800">새로운 회고</h2>
      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-8">
        <div className="bg-violet-500 h-2.5 rounded-full" style={{ width: `${(step / 5) * 100}%`, transition: 'width 0.3s ease-in-out' }}></div>
      </div>
      
      <div className="min-h-[320px]">
        {renderStep()}
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={step === 1 ? onBack : handleBack}
          className="text-slate-600 font-semibold py-3 px-6 rounded-lg hover:bg-slate-100 transition"
        >
          {step === 1 ? '취소' : '뒤로'}
        </button>
        {step < 5 ? (
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="bg-violet-500 text-white font-bold py-3 px-8 rounded-lg shadow hover:bg-violet-600 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            다음
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isStepValid()}
            className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg shadow hover:bg-green-600 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            시뮬레이션 시작
          </button>
        )}
      </div>
    </div>
  );
};

export default SituationInputScreen;
