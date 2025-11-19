# TIMEMACHINE AI – 프론트엔드

이 폴더는 사용자가 회고 내용을 입력하고, AI와 대화를 나누며, 리포트를 확인할 수 있는 React 앱입니다. 브라우저는 FastAPI 백엔드만 호출하고, Gemini 키는 서버 쪽에서만 사용하므로 프런트에는 노출되지 않습니다.

---

## 1. 가장 빠르게 실행하기

1. [Node.js 20+](https://nodejs.org/ko) 를 설치합니다.
2. 프로젝트 루트에서 `frontend` 폴더로 이동합니다.
3. 아래 순서를 그대로 입력하세요.

```bash
cd frontend
npm install
cp .env.example .env         # 필요하면 VITE_BACKEND_URL 수정
npm run dev
```

- 브라우저에서 <http://localhost:3000> 을 열면 앱이 보입니다.
- 백엔드 주소가 바뀌면 `.env` 의 `VITE_BACKEND_URL` 만 바꿔 주면 됩니다.
- 배포 혹은 테스트 빌드가 필요하면 `npm run build` → `npm run preview` 순서로 확인하세요.

---

## 2. 자주 쓰는 npm 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 (파일 저장 시 자동 새로고침) |
| `npm run build` | 프로덕션 번들 생성 (`dist/`) |
| `npm run preview` | 빌드 결과를 로컬에서 확인 |

---

## 3. 폴더 구조를 간단히 이해하기

```
src/
├── app/
│   └── App.tsx               → 전역 상태 훅을 호출해 라우팅/화면 전환 처리
├── features/
│   ├── auth/                 → AuthScreen.tsx
│   ├── home/                 → HomeScreen.tsx + 가이드 슬라이드
│   ├── input/                → SituationInputScreen.tsx (5단계 폼)
│   ├── simulation/           → SimulationScreen.tsx (채팅 UI)
│   ├── report/               → ReportScreen.tsx
│   ├── diary/                → DiaryScreen.tsx
│   └── reflection/
│       └── hooks/useReflectionApp.ts → 전역 AppState와 액션(로그인/시뮬레이션 등) 정의
├── shared/
│   ├── components/           → 공통 BackButton, 아이콘 SVG 등
│   ├── services/
│   │   ├── geminiService.ts  → 백엔드 fetch 함수 집합
│   │   └── storageService.ts → LocalStorage 접근 유틸
│   └── types.ts              → Screen, Reflection 등 공통 타입
├── assets/                   → 이미지/아이콘 리소스
└── main.tsx                  → ReactDOM.createRoot 진입점
```

핵심은 `features` 폴더 하나만 보면 “어떤 화면이 있는지” 바로 파악된다는 점입니다. 전역 상태는 `useReflectionApp` 훅 한 곳에서 관리하고, 각 화면은 필요한 액션만 props로 받아 사용합니다.

---

## 4. 어떤 화면이 있나요?

- **Auth** – 이메일과 비밀번호만으로 로그인/회원가입을 흉내 내는 데모 UI입니다. 실제 인증 서버는 없고 LocalStorage 에 저장합니다.
- **Home** – “새 회고 시작” / “나의 회고 목록” / 사용 가이드를 보여 줍니다.
- **Input** – 5단계 폼에서 상황, 감정, 행동, 원하는 결과, persona 정보를 모읍니다.
- **Simulation** – 백엔드 `/api/reflections/chat` 을 불러 AI와 대화를 나눕니다. 턴수를 넘기면 연장 팝업이 뜹니다.
- **Report** – `/api/reflections/summary` 응답을 카드 스타일로 보여주고 일기에 저장할 수 있습니다.
- **Diary** – 저장된 회고 목록을 감정별로 필터링하고, 보고서를 다시 열람합니다.

---

## 5. 백엔드와 어떻게 통신하나요?

- 모든 통신은 `shared/services/geminiService.ts` 를 통해 이루어집니다.
  - `generateReport(reflection)` → `/api/reflections/summary`
  - `requestChatReply(reflection, conversation, message)` → `/api/reflections/chat`
- LocalStorage 접근은 `shared/services/storageService.ts` 에서 관리합니다. `useReflectionApp` 훅이 이 서비스를 사용해 사용자/다이어리 상태를 불러오고 저장합니다.

---

## 6. 새 팀원을 위해: 개발 흐름 요약

1. `npm run dev` 로 브라우저에서 앱을 띄웁니다.
2. `features` 폴더에서 만들고 싶은 화면(혹은 기능)을 찾습니다.
3. 필요한 전역 상태나 액션은 `useReflectionApp` 훅에 추가합니다.
4. 백엔드 호출이 필요하면 `shared/services/geminiService.ts` 에 fetch 함수를 정의한 뒤 사용하는 화면에 주입합니다.
5. 공통 UI가 필요하면 `shared/components` 에 작은 컴포넌트를 만들고 재사용합니다.

이 흐름만 익히면 누구나 손쉽게 기능을 추가할 수 있습니다.

---

## 7. 도움말

- 백엔드만 실행되어 있다면, 이 프런트는 명령어 몇 개로 바로 올릴 수 있습니다.
- TypeScript를 두려워하지 마세요. `shared/types.ts` 에 정의된 타입을 참고하면 컴파일러가 대부분의 실수를 잡아줍니다.
- 추가로 궁금한 점이 있다면 README 최상단을 다시 읽어 보거나, `features/reflection/hooks/useReflectionApp.ts` 를 열어 앱 전체 흐름을 확인해 보세요.
