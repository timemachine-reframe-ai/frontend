import React from 'react';
import { Reflection } from '@/shared/types';
import PlusIcon from '@/shared/components/icons/PlusIcon';
import LogoutIcon from '@/shared/components/icons/LogoutIcon';

interface DiaryScreenProps {
  diary: Reflection[];
  onViewReport: (reflection: Reflection) => void;
  onNewReflection: () => void;
  onLogout: () => void;
}

const DiaryScreen: React.FC<DiaryScreenProps> = ({ diary, onViewReport, onNewReflection, onLogout }) => {
  const sortedDiary = [...diary].sort(
    (a, b) => new Date(b.id).getTime() - new Date(a.id).getTime(),
  );

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
                const badgeEmotion = reflection.emotions[0] || '기록';
                const title =
                  reflection.whatHappened ||
                  reflection.report?.summary ||
                  '저장된 회고 내용이 없습니다.';
                const summary =
                  reflection.report?.summary ||
                  reflection.report?.suggestedPhrases?.[0] ||
                  '요약이 없습니다.';

                return (
                  <div
                    key={reflection.id}
                    className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-sm text-slate-500">{reflection.date}</p>
                        <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full flex-shrink-0 ml-2">
                          {badgeEmotion}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800 mt-1 text-lg leading-snug">{title}</p>
                      <p className="text-sm text-slate-600 mt-4 line-clamp-3">{summary}</p>
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
                );
              })}
            </div>
        )}
      </div>
    </div>
  );
};

export default DiaryScreen;
