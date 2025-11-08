import React, { useEffect, useState } from 'react';
import { Reflection } from '../types';
import CheckIcon from '../components/icons/CheckIcon';
import SparklesIcon from '../components/icons/SparklesIcon';

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

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg animate-fade-in">
        <div className="relative text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">AI 회고 리포트</h2>
            {showCheck && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 rounded-full p-2 animate-bounce">
                    <CheckIcon className="w-8 h-8 text-white" />
                </div>
            )}
        </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-violet-700 mb-3">상황 요약</h3>
          <p className="text-slate-600 bg-slate-50 p-4 rounded-lg leading-relaxed">{report.summary}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-violet-700 mb-3">핵심 인사이트</h3>
          <ul className="list-disc list-inside space-y-3 text-slate-600 pl-2">
            {report.keyInsights.map((insight, i) => <li key={i}>{insight}</li>)}
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-violet-700 mb-3">제안하는 표현</h3>
          <div className="space-y-3">
            {report.suggestedPhrases.map((phrase, i) => (
              <p key={i} className="bg-violet-50 text-violet-800 p-4 rounded-lg italic">"{phrase}"</p>
            ))}
          </div>
        </div>
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