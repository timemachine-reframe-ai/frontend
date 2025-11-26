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

const GuideSlideContent = ({ step, isFirstStep, selectedImageIndex, onThumbnailClick, isInvisible }) => {
  const content = isFirstStep ? (
    <>
      <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-[16/9] group bg-slate-200">
        <img
          src={step.images[selectedImageIndex]}
          alt={step.alt}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="grid grid-cols-5 gap-3 w-full mt-4">
        {step.images.map((imgSrc, imgIndex) => (
          <div
            key={imgIndex}
            className={`relative rounded-lg overflow-hidden cursor-pointer aspect-[4/3] bg-slate-200 transition-all duration-300 ${selectedImageIndex === imgIndex
              ? 'ring-2 ring-primary-500 ring-offset-2 scale-105 shadow-md'
              : 'opacity-70 hover:opacity-100 hover:scale-105'
              }`}
            onClick={() => onThumbnailClick(imgIndex)}
          >
            <img
              src={imgSrc}
              alt={`Thumbnail ${imgIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <div className="text-left w-full mt-6 space-y-2">
        <h5 className="text-2xl font-bold text-primary-700">{step.title}</h5>
        <p className="text-slate-600 leading-relaxed text-lg">{step.description}</p>
      </div>
    </>
  ) : (
    <>
      <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-[16/9] group bg-slate-200">
        <img
          src={step.image}
          alt={step.alt}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="text-left w-full mt-6 space-y-2">
        <h5 className="text-2xl font-bold text-primary-700">{step.title}</h5>
        <p className="text-slate-600 leading-relaxed text-lg">{step.description}</p>
      </div>
    </>
  );

  return (
    <div className={`flex flex-col items-start w-full pb-8 ${isInvisible ? 'invisible' : ''}`}>
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
    <div className="min-h-screen text-slate-900 flex flex-col bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
      {/* Top bar */}
      <nav className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="container mx-auto px-4 py-3 grid grid-cols-3 items-center">
          <div className="flex items-center gap-3">
            {user ? (
              <div className="text-left animate-fade-in">
                <p className="text-xs text-slate-500 font-medium">반가워요,</p>
                <p className="text-sm font-bold text-slate-800">{displayName}님</p>
              </div>
            ) : (
              <div className="hidden sm:block" aria-hidden="true" />
            )}
          </div>

          <div className="flex flex-col items-center justify-center group cursor-default">
            <div className="flex items-center gap-2 text-primary-700 mb-0.5">
              <div className="w-8 h-8 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                <TimemachineLogo className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">TIMEMACHINE AI</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold group-hover:text-primary-500 transition-colors">Emotional Reframing Platform</p>
          </div>

          <div className="flex items-center gap-3 justify-end">
            {isGuest ? (
              <>
                <button
                  onClick={onLogin}
                  className="hidden sm:inline text-sm font-semibold text-slate-600 hover:text-primary-600 px-4 py-2 rounded-full hover:bg-slate-50 transition-colors"
                >
                  로그인
                </button>
                <button
                  onClick={handleStartClick}
                  className="text-sm font-bold bg-primary-700 text-white px-5 py-2.5 rounded-full hover:bg-primary-800 hover:shadow-lg hover:shadow-primary-500/30 transition-all active:scale-95"
                >
                  무료로 시작
                </button>
              </>
            ) : (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-500 px-4 py-2 rounded-full hover:bg-red-50 transition-all group"
                aria-label="로그아웃"
              >
                <LogoutIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline">로그아웃</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 w-full container mx-auto px-4">
        <div className="w-full py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="text-left space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-bold tracking-wide uppercase shadow-sm">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>TIMEMACHINE AI · 감정 리프레이밍</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.1] text-slate-900 tracking-tight">
              감정을 다시 써보는<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">대화형 타임머신</span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-xl">
              과거의 갈등 상황으로 돌아가 다른 선택을 실험해보세요.
              AI와의 시뮬레이션을 통해 감정의 매듭을 풀고,
              더 나은 소통 방식을 발견할 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={handleStartClick}
                className="bg-primary-700 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-primary-500/20 hover:bg-primary-800 hover:shadow-2xl hover:shadow-primary-500/30 hover:-translate-y-1 transition-all active:scale-95 active:translate-y-0"
              >
                무료로 시작하기
              </button>
              <button
                onClick={handleDiaryClick}
                className="bg-white text-slate-700 border border-slate-200 font-bold text-lg px-8 py-4 rounded-2xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all active:scale-95"
              >
                회고 목록 보기
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              {[
                { icon: TimemachineLogo, title: "정교한 재현", desc: "사건·감정·인물 정보 반영" },
                { icon: SparklesIcon, title: "선택 실험", desc: "다른 선택지와 코칭 확인" },
                { icon: DiaryIcon, title: "표준 리포트", desc: "감정 흐름·패턴 자동 분석" },
              ].map((item, i) => (
                <div key={i} className="group p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-primary-100 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="relative bg-white/60 backdrop-blur-xl border border-white/60 shadow-2xl shadow-primary-900/5 rounded-[2.5rem] p-10 space-y-8">
              {[
                { num: "01", title: "회고 생성", desc: "사건·감정·상대 정보를 입력해 맥락을 준비합니다." },
                { num: "02", title: "감정 시뮬레이션", desc: "AI와 대화하며 다른 선택을 실험하고 코칭을 받습니다." },
                { num: "03", title: "감정 리포트", desc: "감정 흐름과 패턴, 행동 제안을 자동으로 받아봅니다." },
                { num: "04", title: "기록 관리", desc: "회고와 리포트를 저장하고 언제든 다시 열람합니다." },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-5 group">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xl font-black text-primary-300 group-hover:text-primary-600 group-hover:border-primary-200 group-hover:shadow-primary-100 transition-all duration-300">
                    {step.num}
                  </div>
                  <div className="pt-1">
                    <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary-700 transition-colors">{step.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Guide */}
        <div className="w-full pb-20">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="p-8 md:p-12 bg-gradient-to-b from-white to-slate-50/50">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-2xl md:text-3xl mb-3">사용 가이드</h3>
                  <p className="text-slate-600 text-lg">
                    실제 화면을 보며 흐름을 빠르게 확인하세요.
                  </p>
                </div>
              </div>

              <div className="relative min-h-[500px] bg-slate-100 rounded-3xl border border-slate-200/60 p-6 md:p-8">
                {/* Navigation Buttons */}
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-white hover:border-primary-300 hover:text-primary-600 hover:shadow-md disabled:opacity-0 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentStep === guideSteps.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-primary-700 text-white flex items-center justify-center shadow-lg shadow-primary-500/30 hover:bg-primary-800 hover:scale-105 disabled:opacity-0 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
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
                    className={`transition-all duration-500 ease-out absolute top-0 left-0 w-full h-full p-6 md:p-8 flex flex-col items-start justify-center ${index === currentStep
                      ? 'opacity-100 translate-x-0'
                      : index < currentStep
                        ? 'opacity-0 -translate-x-10 pointer-events-none'
                        : 'opacity-0 translate-x-10 pointer-events-none'
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

              <div className="flex justify-center gap-3 mt-8">
                {guideSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${currentStep === index ? 'w-8 bg-primary-600' : 'w-2 bg-slate-300 hover:bg-primary-300'
                      }`}
                    aria-label={`Go to step ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;
