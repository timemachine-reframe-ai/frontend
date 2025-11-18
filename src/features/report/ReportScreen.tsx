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
        <SparklesIcon className="w-16 h-16 text-violet-500 animate-pulse mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">리포트를 생성 중입니다...</h2>
        <p className="mt-2 text-slate-600">AI가 당신의 대화를 분석하여 인사이트를 제공하고 있습니다.</p>
      </div>
    );
  }

  const summaryParagraphs = report.summary
    .split(/[\n\r]+/)
    .map(line => line.trim())
    .filter(Boolean);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg animate-fade-in">
      <div className="relative text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">AI 회고 리포트</h2>
        {showCheck && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 rounded-full p-2 animate-bounce">
            <CheckIcon className="w-8 h-8 text-white" />
          </div>
        )}
        <p className="text-sm text-slate-500 mt-2">상황 정보와 시뮬레이션 대화를 바탕으로 AI가 정리했습니다.</p>
      </div>

      <div className="space-y-8">
        <section className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-violet-700 mb-3">상황 요약</h3>
          <div className="space-y-3 text-slate-700 leading-relaxed">
            {summaryParagraphs.length ? (
              summaryParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p>요약이 준비되는 중입니다.</p>
            )}
          </div>
        </section>

        <section className="bg-white border border-violet-100 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-semibold text-violet-700 mb-4">핵심 인사이트</h3>
          {report.keyInsights.length ? (
            <ul className="space-y-3">
              {report.keyInsights.map((insight, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 bg-violet-50 text-slate-700 rounded-xl p-4"
                >
                  <span className="text-violet-500 font-bold mt-1">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">핵심 인사이트를 정리하는 중입니다.</p>
          )}
        </section>

        <section className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-sm">
          <h3 className="text-xl font-semibold text-emerald-700 mb-4">제안하는 표현</h3>
          {report.suggestedPhrases.length ? (
            <div className="grid gap-3">
              {report.suggestedPhrases.map((phrase, i) => (
                <div key={i} className="bg-emerald-50 text-emerald-800 p-4 rounded-xl italic">
                  “{phrase}”
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">추천 표현을 정리하는 중입니다.</p>
          )}
        </section>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        {onSave && (
          <button
            onClick={onSave}
            className="flex-1 bg-violet-500 text-white font-bold py-4 px-6 rounded-xl shadow hover:bg-violet-600 transition"
          >
            일기에 저장
          </button>
        )}
        <button
          onClick={onHome}
          className="flex-1 bg-slate-200 text-slate-700 font-bold py-4 px-6 rounded-xl hover:bg-slate-300 transition"
        >
          {onSave ? '완료' : '일기로 돌아가기'}
        </button>
      </div>
    </div>
  );
};

export default ReportScreen;
