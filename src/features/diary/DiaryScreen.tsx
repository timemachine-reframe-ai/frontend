import React from 'react';
import { Reflection, Emotion, EMOTIONS } from '@/shared/types';
import PlusIcon from '@/shared/components/icons/PlusIcon';
import LogoutIcon from '@/shared/components/icons/LogoutIcon';
import TrashIcon from '@/shared/components/icons/TrashIcon';

interface DiaryScreenProps {
  diary: Reflection[];
  onViewReport: (reflection: Reflection) => void;
  onNewReflection: () => void;
  onLogout: () => void;
  onDelete: (id: string) => void;
}

const DiaryScreen: React.FC<DiaryScreenProps> = ({ diary, onViewReport, onNewReflection, onLogout, onDelete }) => {
  const sortedDiary = [...diary].sort(
    (a, b) => new Date(b.id).getTime() - new Date(a.id).getTime(),
  );

  return (
    <div className="animate-fade-in p-2 md:p-4">
      <div className="flex justify-between items-center mb-4 md:mb-6">
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

      <div>
        {sortedDiary.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-slate-500 text-lg">
              아직 저장된 회고가 없습니다.
            </p>
            <button onClick={onNewReflection} className="mt-6 text-violet-600 font-semibold hover:underline">
              첫 회고를 시작해보세요
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDiary.map(reflection => {
              return (
                <div
                  key={reflection.id}
                  className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-xs text-slate-400 font-medium">{reflection.date}</p>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[70%]">
                        {reflection.emotions.length > 0 ? (
                          reflection.emotions.map((emotion, idx) => (
                            <span key={idx} className="text-[10px] font-bold bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full border border-violet-100">
                              {emotion}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                            기록
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-extrabold text-slate-800 mb-1.5 uppercase tracking-wider">상황 요약</p>
                      <p className="text-base text-slate-600 leading-relaxed line-clamp-4">
                        {(() => {
                          const text = reflection.whatHappened || '상황 설명이 없습니다.';
                          const firstPeriodIndex = text.indexOf('.');
                          return firstPeriodIndex !== -1 ? text.substring(0, firstPeriodIndex + 1) : text;
                        })()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('정말 이 회고를 삭제하시겠습니까?')) {
                          onDelete(reflection.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-500 transition p-2 rounded-full hover:bg-red-50"
                      aria-label="삭제"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onViewReport(reflection)}
                      className="text-sm font-bold text-violet-600 hover:text-violet-800 transition flex items-center gap-1"
                    >
                      리포트 보기 <span className="text-lg leading-none">&rarr;</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiaryScreen;
