import React, { useEffect, useState } from 'react';
import { Reflection } from '@/shared/types';
import CheckIcon from '@/shared/components/icons/CheckIcon';
import SparklesIcon from '@/shared/components/icons/SparklesIcon';

interface ReportScreenProps {
  reflection: Reflection;
  onSave?: () => void;
  onHome: () => void;
}

const ReportScreen: React.FC<ReportScreenProps> = ({ reflection, onSave, onHome }) => {
  const { report } = reflection;
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (report && onSave) {
      const timer = setTimeout(() => setShowCheck(true), 500);
      return () => clearTimeout(timer);
    }
  }, [report, onSave]);

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 animate-fade-in max-w-lg mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100/50 rounded-full blur-2xl -mr-8 -mt-8 animate-pulse pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary-100/50 rounded-full blur-2xl -ml-8 -mb-8 animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full animate-ping opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white rounded-full flex items-center justify-center shadow-sm border border-primary-100/50 z-10">
                <span className="text-4xl animate-bounce">🤔</span>
              </div>
              <div className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>💭</div>
              <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>💡</div>
              <div className="absolute top-1/2 -right-6 text-xl animate-pulse">✨</div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-3">감정을 분석하고 있어요...</h2>
            <div className="flex gap-2 justify-center mb-4">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              대화 속에 숨겨진 의미를 찾고<br />
              더 나은 대화 방향을 고민하고 있습니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const summaryParagraphs = report.summary
    .split(/[\n\r]+/)
    .map(line => line.trim())
    .filter(Boolean);

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 animate-fade-in max-w-4xl mx-auto relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-100/50 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

      <div className="relative text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 text-primary-600 mb-6 shadow-sm">
          <SparklesIcon className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">AI 회고 리포트</h2>
        {showCheck && (
          <div className="absolute top-0 right-10 bg-green-500 rounded-full p-2 animate-bounce shadow-lg shadow-green-500/30">
            <CheckIcon className="w-6 h-6 text-white" />
          </div>
        )}
        <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
          시뮬레이션 대화를 바탕으로 분석한<br className="hidden sm:block" />
          <span className="text-primary-700 font-bold">감정 흐름</span>과 <span className="text-secondary-700 font-bold">핵심 인사이트</span>입니다.
        </p>
      </div>

      <div className="space-y-8 relative z-10">
        <section className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">상황 요약</h3>
          </div>
          <div className="space-y-3 text-slate-600 leading-relaxed text-lg">
            {summaryParagraphs.length ? (
              summaryParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p className="text-slate-400 italic">요약이 준비되는 중입니다.</p>
            )}
          </div>
        </section>

        <section className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.75 3c1.995 0 3.529.982 4.25 2.561C12.72 4.005 14.254 3 16.25 3c3.036 0 5.5 2.322 5.5 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.47 0l-.003-.001z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-sky-800">심리상담사의 조언</h3>
          </div>
          <div className="bg-white border border-sky-100/50 p-6 rounded-2xl shadow-sm">
            {report.counselorAdvice && report.counselorAdvice.length ? (
              <ul className="space-y-4">
                {report.counselorAdvice.map((advice, index) => (
                  <li key={index} className="text-sky-700 leading-relaxed text-lg font-medium whitespace-pre-line">
                    {advice}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 italic">참고할 상담사 조언을 모으는 중입니다.</p>
            )}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-gradient-to-br from-violet-50 to-white border border-violet-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-violet-800">핵심 인사이트</h3>
            </div>
            {report.keyInsights.length ? (
              <ul className="space-y-4">
                {report.keyInsights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                    <span className="text-slate-700 leading-relaxed font-medium">{insight}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 italic">핵심 인사이트를 정리하는 중입니다.</p>
            )}
          </section>

          <section className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-emerald-800">제안하는 표현</h3>
            </div>
            {report.suggestedPhrases.length ? (
              <div className="space-y-4">
                {report.suggestedPhrases.map((phrase, i) => (
                  <div key={i} className="bg-white border border-emerald-100/50 p-4 rounded-xl shadow-sm">
                    <p className="text-emerald-700 italic font-medium leading-relaxed">"{phrase}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 italic">추천 표현을 정리하는 중입니다.</p>
            )}
          </section>
        </div>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-4 relative z-10">
        {onSave && (
          <button
            onClick={onSave}
            className="flex-1 bg-primary-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-primary-500/20 hover:bg-primary-700 hover:shadow-2xl hover:shadow-primary-500/30 hover:-translate-y-1 transition-all active:scale-95"
          >
            일기에 저장하기
          </button>
        )}
        <button
          onClick={onHome}
          className="flex-1 bg-white text-slate-600 border border-slate-200 font-bold py-4 px-8 rounded-2xl hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all active:scale-95"
        >
          {onSave ? '저장 없이 종료' : '일기로 돌아가기'}
        </button>
      </div>
    </div>
  );
};

export default ReportScreen;
