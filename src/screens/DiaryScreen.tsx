import React, { useState, useMemo } from 'react';
import { Reflection, Emotion, EMOTIONS } from '../types';
import PlusIcon from '../components/icons/PlusIcon';
import LogoutIcon from '../components/icons/LogoutIcon';

interface DiaryScreenProps {
  diary: Reflection[];
  onViewReport: (reflection: Reflection) => void;
  onNewReflection: () => void;
  onLogout: () => void;
}

const DiaryScreen: React.FC<DiaryScreenProps> = ({ diary, onViewReport, onNewReflection, onLogout }) => {
  const [emotionFilter, setEmotionFilter] = useState<Emotion | 'all'>('all');
  
  const filteredDiary = useMemo(() => {
    if (emotionFilter === 'all') {
      return diary;
    }
    return diary.filter(entry => entry.emotions.includes(emotionFilter));
  }, [diary, emotionFilter]);
  
  return (
    <div className="animate-fade-in p-2 md:p-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-slate-800">나의 회고 목록</h2>
        <div className="flex items-center gap-3">
          <button
              onClick={onNewReflection}
              className="bg-violet-500 text-white p-3 rounded-full shadow-lg hover:bg-violet-600 transition transform hover:scale-110"
              aria-label="새로운 회고"
          >
              <PlusIcon className="w-7 h-7" />
          </button>
          <button
              onClick={onLogout}
              className="bg-slate-200 text-slate-600 p-3 rounded-full shadow-lg hover:bg-slate-300 transition transform hover:scale-110"
              aria-label="로그아웃"
          >
              <LogoutIcon className="w-7 h-7" />
          </button>
        </div>
      </div>
      
      <div className="mb-8 p-4 bg-white rounded-2xl shadow-sm">
        <label className="text-sm font-semibold text-slate-600 mb-3 block">감정으로 필터링:</label>
        <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setEmotionFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                emotionFilter === 'all'
                  ? 'bg-violet-500 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              전체
            </button>
          {EMOTIONS.map(emotion => (
            <button
              key={emotion}
              onClick={() => setEmotionFilter(emotion)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                emotionFilter === emotion
                  ? 'bg-violet-500 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>

      <div>
        {filteredDiary.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                <p className="text-slate-500 text-lg">
                    {emotionFilter === 'all' ? "아직 저장된 회고가 없습니다." : `"${emotionFilter}"에 대한 회고를 찾을 수 없습니다.`}
                </p>
                <button onClick={onNewReflection} className="mt-6 text-violet-600 font-semibold hover:underline">
                    첫 회고를 시작해보세요
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiary.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime()).map(reflection => (
            <div key={reflection.id} className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                    <p className="text-sm text-slate-500">{reflection.date}</p>
                    <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full flex-shrink-0 ml-2">{reflection.emotions[0]}</span>
                </div>
                <p className="font-semibold text-slate-800 mt-1 text-lg leading-snug">{reflection.whatHappened}</p>
                <p className="text-sm text-slate-600 mt-4 line-clamp-3">
                    {reflection.report?.summary || "요약이 없습니다."}
                </p>
              </div>
              <div className="mt-5 text-right">
                 <button 
                    onClick={() => onViewReport(reflection)}
                    className="text-violet-600 font-bold hover:text-violet-800 transition"
                 >
                    리포트 보기 &rarr;
                </button>
              </div>
            </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default DiaryScreen;