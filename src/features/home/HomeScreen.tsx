import React from 'react';
import DiaryIcon from '@/shared/components/icons/DiaryIcon';
import LogoutIcon from '@/shared/components/icons/LogoutIcon';
import { User } from '@/shared/types';
import ChevronLeftIcon from '@/shared/components/icons/ChevronLeftIcon';
import ChevronRightIcon from '@/shared/components/icons/ChevronRightIcon';
import TimemachineLogo from '@/shared/components/icons/TimemachineLogo';
import SparklesIcon from '@/shared/components/icons/SparklesIcon';

interface HomeScreenProps {
  user: User | null;
  onStart: () => void;
  onDiary: () => void;
  onLogout: () => void;
  onLogin: () => void;
}

const guideSteps = [
  {
    images: [
      "src/assets/images/guide-input1.png",
      "src/assets/images/guide-input2.png",
      "src/assets/images/guide-input3.png",
      "src/assets/images/guide-input4.png",
      "src/assets/images/guide-input5.png",
    ],
    alt: "상황 입력 예시",
    title: "1. 상황 입력",
    description: "최근에 있었던 문제 상황과 그 때 당신이 느낀 감정, 상대방의 정보등을 간단히 입력하세요. AI가 맥락을 이해하고 대화를 준비합니다.",
  },
  {
    image: "src/assets/images/guide-simulation.png",
    alt: "AI 대화 예시",
    title: "2. 대화 시뮬레이션",
    description: "그때 상황으로 다시 돌아가 AI를 상대로 대화를 시뮬레이션 합니다. 이번에는 원하던 결과를 얻을 수 있도록 더 나은 소통을 해 봅시다.",
  },
  {
    image: "src/assets/images/guide-report.png",
    alt: "리포트 생성 예시",
    title: "3. 리포트 생성",
    description: "대화가 끝나면 AI가 당신의 감정 흐름과 통찰을 분석해 리포트를 제공합니다. 성장의 포인트를 확인하세요.",
  },
  {
    image: "src/assets/images/guide-list.png",
    alt: "회고 목록 예시",
    title: "4. 회고 목록에서 다시 보기",
    description: "저장된 회고 기록을 언제든 다시 열람하며 자신의 변화와 성장 과정을 추적할 수 있습니다.",
  },
];

// @ts-ignore
const GuideSlideContent = ({ step, isFirstStep, selectedImageIndex, onThumbnailClick, isInvisible }) => {
  const content = isFirstStep ? (
    <>
      <img
        src={step.images[selectedImageIndex]}
        alt={step.alt}
        className="w-full rounded-lg shadow-md object-cover aspect-[4/3]"
      />
      <div className="grid grid-cols-5 gap-2 w-full">
        {step.images.map((imgSrc, imgIndex) => (
          <img
            key={imgIndex}
            src={imgSrc}
            alt={`Thumbnail ${imgIndex + 1}`}
            className={`w-full rounded-md cursor-pointer border-2 transition-colors ${
              selectedImageIndex === imgIndex ? 'border-violet-700' : 'border-transparent hover:border-violet-300'
            }`}
            onClick={() => onThumbnailClick(imgIndex)}
          />
        ))}
      </div>
      <div className="text-left w-full">
        <h5 className="text-xl font-bold text-violet-700 mb-2">{step.title}</h5>
        <p className="text-slate-600">{step.description}</p>
      </div>
    </>
  ) : (
    <>
      <img
        src={step.image}
        alt={step.alt}
        className="w-full rounded-lg shadow-md object-cover aspect-[4/3]"
      />
      <div className="text-left w-full">
        <h5 className="text-xl font-bold text-violet-700 mb-2">{step.title}</h5>
        <p className="text-slate-600">{step.description}</p>
      </div>
    </>
  );

  return (
    <div className={`flex flex-col items-start gap-6 w-full pb-12 ${isInvisible ? 'invisible' : ''}`}>
      {content}
    </div>
  );
};


const HomeScreen: React.FC<HomeScreenProps> = ({ user, onStart, onDiary, onLogout, onLogin }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const isGuest = !user;
  const displayName = (user && (user.name || user.username || user.loginId)) || '게스트';

  const handleNext = () => {
    setCurrentStep((prev) => (prev < guideSteps.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleStartClick = () => {
    if (isGuest) {
      onLogin();
      return;
    }
    onStart();
  };

  const handleDiaryClick = () => {
    if (isGuest) {
      onLogin();
      return;
    }
    onDiary();
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Top bar */}
      <nav className="w-full">
        <div className="w-full px-0 py-3 grid grid-cols-3 items-center">
          <div className="flex items-center gap-3">
            {user ? (
              <div className="text-left">
                <p className="text-xs text-slate-500">반가워요,</p>
                <p className="text-sm font-semibold text-slate-800">{displayName}</p>
              </div>
            ) : (
              <div className="hidden sm:block" aria-hidden="true" />
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-violet-700">
            <div className="w-11 h-11 rounded-2xl bg-white/60 backdrop-blur border border-violet-200 flex items-center justify-center">
              <TimemachineLogo className="w-8 h-8 text-violet-700" />
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-extrabold leading-tight tracking-tight text-slate-900">TIMEMACHINE AI</p>
              <p className="text-[11px] md:text-xs uppercase tracking-[0.22em] text-slate-500 font-medium">Emotional Reframing Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end">
            {isGuest ? (
              <>
                <button
                  onClick={onLogin}
                  className="hidden sm:inline text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2"
                >
                  로그인
                </button>
                <button
                  onClick={handleStartClick}
                  className="text-sm font-semibold bg-violet-700 text-white px-4 py-2 rounded-xl hover:bg-violet-800 transition shadow-sm"
                >
                  무료로 시작
                </button>
              </>
            ) : (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-violet-600 px-3 py-2 transition-colors"
                aria-label="로그아웃"
              >
                <LogoutIcon className="w-5 h-5" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 w-full">
        <div className="w-full px-0 py-6 grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div className="text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold tracking-wide uppercase">
              TIMEMACHINE AI · 감정 리프레이밍
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
              <br className="hidden md:block" /> 감정을 다시 써보는 대화형 타임머신
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              과거 갈등을 재현하고 다른 선택을 실험하세요. 시뮬레이션 후 곧바로 감정 리포트를 받아 성찰까지 완성합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStartClick}
                className="bg-violet-700 text-white font-semibold px-5 py-3 rounded-xl shadow hover:bg-violet-800 transition"
              >
                무료로 시작하기
              </button>
              <button
                onClick={handleDiaryClick}
                className="bg-white text-violet-700 border border-violet-200 font-semibold px-5 py-3 rounded-xl hover:bg-violet-50 transition"
              >
                회고 목록 보기
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-700">
              <div className="rounded-xl border border-violet-100 bg-white px-3 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
                    <TimemachineLogo className="w-5 h-5 text-violet-700" />
                  </div>
                  <p className="font-bold text-base text-slate-900">정교한 재현</p>
                </div>
                <p className="text-slate-600">사건·감정·인물 정보를 반영한 시뮬레이션</p>
              </div>
              <div className="rounded-xl border border-violet-100 bg-white px-3 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-violet-700" />
                  </div>
                  <p className="font-bold text-base text-slate-900">선택 실험</p>
                </div>
                <p className="text-slate-600">다른 선택지와 코칭을 즉시 확인</p>
              </div>
              <div className="rounded-xl border border-violet-100 bg-white px-3 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
                    <DiaryIcon className="w-5 h-5 text-violet-700" />
                  </div>
                  <p className="font-bold text-base text-slate-900">표준 리포트</p>
                </div>
                <p className="text-slate-600">감정 흐름·패턴·행동 제안 자동 생성</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-12 -right-6 w-64 h-64 bg-violet-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
            <div className="absolute -bottom-14 -left-10 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-30 pointer-events-none" />
            <div className="relative bg-white/80 backdrop-blur-md border border-white/50 shadow-xl rounded-3xl p-8 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-800 font-bold">
                  01
                </div>
                <div>
                  <p className="font-semibold text-slate-900">회고 생성</p>
                  <p className="text-sm text-slate-600">사건·감정·상대 정보를 입력해 맥락을 준비합니다.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-800 font-bold">
                  02
                </div>
                <div>
                  <p className="font-semibold text-slate-900">감정 시뮬레이션</p>
                  <p className="text-sm text-slate-600">AI와 대화하며 다른 선택을 실험하고 코칭을 받습니다.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-800 font-bold">
                  03
                </div>
                <div>
                  <p className="font-semibold text-slate-900">감정 리포트</p>
                  <p className="text-sm text-slate-600">감정 흐름과 패턴, 행동 제안을 자동으로 받아봅니다.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-800 font-bold">
                  04
                </div>
                <div>
                  <p className="font-semibold text-slate-900">기록 관리</p>
                  <p className="text-sm text-slate-600">회고와 리포트를 저장하고 언제든 다시 열람합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guide */}
        <div className="w-full px-0 pb-10">
          <div className="bg-white/85 backdrop-blur p-8 rounded-3xl shadow-md border border-white/50">
            <h3 className="font-bold text-slate-700 mb-3 text-xl">사용 가이드</h3>
            <p className="text-base text-slate-600 max-w-2xl">
              실제 화면을 보며 흐름을 빠르게 확인하세요. 모바일 1단, 데스크톱 2단 레이아웃으로 어디서나 동일한 경험을 제공합니다.
            </p>
            <div className="mt-8">
              <div className="relative">
                <div className="relative bg-violet-50 p-6 rounded-xl border border-violet-100">
                  <GuideSlideContent
                    step={guideSteps[currentStep]}
                    isFirstStep={currentStep === 0}
                    selectedImageIndex={selectedImageIndex}
                    onThumbnailClick={setSelectedImageIndex}
                    isInvisible={true}
                  />

                  {guideSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`transition-opacity duration-500 ease-in-out absolute top-0 left-0 w-full h-full p-6 flex flex-col items-start justify-center ${
                        index === currentStep ? 'opacity-100' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <GuideSlideContent
                        step={step}
                        isFirstStep={index === 0}
                        selectedImageIndex={selectedImageIndex}
                        onThumbnailClick={setSelectedImageIndex}
                        isInvisible={false}
                      />
                    </div>
                  ))}
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                  {guideSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        currentStep === index ? 'bg-violet-700' : 'bg-violet-200 hover:bg-violet-300'
                      }`}
                      aria-label={`Go to step ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="absolute top-1/2 left-2 -translate-y-1/2 bg-white border border-slate-200 hover:border-violet-200 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  aria-label="Previous step"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-violet-700" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentStep === guideSteps.length - 1}
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-white border border-slate-200 hover:border-violet-200 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  aria-label="Next step"
                >
                  <ChevronRightIcon className="w-6 h-6 text-violet-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
