import React from 'react';
import PlusIcon from '@/shared/components/icons/PlusIcon';
import DiaryIcon from '@/shared/components/icons/DiaryIcon';
import LogoutIcon from '@/shared/components/icons/LogoutIcon';
import { User } from '@/shared/types';
import ChevronLeftIcon from '@/shared/components/icons/ChevronLeftIcon';
import ChevronRightIcon from '@/shared/components/icons/ChevronRightIcon';

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
    <div className="flex flex-col items-center justify-center text-center p-4 animate-fade-in w-full">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center w-full mb-8">
            {user && (
              <div className="text-left">
                  <p className="text-lg text-slate-500">환영합니다,</p>
                  <p className="font-semibold text-xl text-slate-700">{displayName}님</p>
              </div>
            )}
            {isGuest ? (
              <button
                onClick={onLogin}
                className="flex items-center gap-2 text-violet-700 hover:text-violet-800 transition-colors group font-semibold"
                aria-label="로그인"
              >
                <span className="hidden sm:inline group-hover:underline">로그인</span>
              </button>
            ) : (
              <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-slate-500 hover:text-violet-600 transition-colors group"
                  aria-label="로그아웃"
              >
                  <LogoutIcon className="w-6 h-6" />
                  <span className="font-semibold hidden sm:inline group-hover:underline">로그아웃</span>
              </button>
            )}
        </div>

        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800">
            TIMEMACHINE AI
          </h1>
          <p className="mt-4 text-xl text-slate-600">
            당신의 감정을 다시 경험하고, 당신의 이야기를 새로 써보세요.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            onClick={handleStartClick}
            className="group cursor-pointer bg-gradient-to-br from-violet-500 to-purple-600 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 flex flex-col items-center text-center"
          >
            <div className="bg-white/20 p-4 rounded-full mb-6">
                <PlusIcon className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">새로운 회고 시작하기</h2>
            <p className="text-violet-100 max-w-xs">
                과거의 특정 상황을 되돌아보고, AI와 함께 대화를 시뮬레이션하여 새로운 관점을 발견하세요.
            </p>
          </div>
          <div
            onClick={handleDiaryClick}
            className="group cursor-pointer bg-white text-slate-700 p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center text-center"
          >
            <div className="bg-slate-100 group-hover:bg-violet-100 p-4 rounded-full mb-6 transition-colors">
                <DiaryIcon className="w-10 h-10 text-slate-600 group-hover:text-violet-600 transition-colors" />
            </div>
            <h2 className="text-2xl font-bold mb-2">나의 회고 목록</h2>
            <p className="text-slate-500 max-w-xs">
                과거에 진행했던 모든 회고 기록과 AI가 생성한 인사이트 리포트를 확인하고 성장을 추적하세요.
            </p>
          </div>
        </div>

        <div className="mt-16">
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md border border-slate-200">
                <h3 className="font-bold text-slate-700 mb-3 text-xl">TIMEMACHINE AI란?</h3>
                <p className="text-base text-slate-600 max-w-2xl mx-auto">
                    이곳은 당신의 감정을 탐색할 수 있는 안전한 공간입니다. 대화 시뮬레이션을 통해 명확성을 얻고, 소통을 연습하며, 자신의 감정적 반응을 더 잘 이해할 수 있습니다.
                </p>
                <div className="mt-8">
                  <h4 className="text-2xl font-semibold text-violet-700 mb-6">사용 가이드</h4>
                  
                  <div className="relative">
                    <div className="relative bg-violet-50 p-6 rounded-xl border border-violet-100">
                      {/* Sizer element to dynamically set container height */}
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
                      className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      aria-label="Previous step"
                    >
                      <ChevronLeftIcon className="w-6 h-6 text-violet-700" />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentStep === guideSteps.length - 1}
                      className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      aria-label="Next step"
                    >
                      <ChevronRightIcon className="w-6 h-6 text-violet-700" />
                    </button>
                  </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
