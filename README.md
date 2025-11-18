# TIMEMACHINE AI – 프론트엔드

타임머신 AI는 감정 회고와 대화 시뮬레이션을 돕는 React 단일 페이지 앱입니다. 브라우저는 FastAPI 백엔드만 호출하며, Gemini API 키는 모두 서버에서 관리됩니다.

---

## 1. 준비물 
1. **Node.js 20 이상** 설치 – [공식 다운로드](https://nodejs.org/ko)
2. 저장소 루트에서 `frontend` 폴더로 이동
3. 아래 순서를 그대로 실행

```bash
cd frontend
npm install                 # 필요한 라이브러리 설치
cp .env.example .env        # 백엔드 주소가 다르면 .env 수정
npm run dev                 # 개발 서버 시작
```

- 브라우저에서 <http://localhost:3000>으로 접속하면 됩니다.
- `VITE_BACKEND_URL` 기본값은 `http://localhost:8000` 이며, 백엔드 주소가 다르면 `.env`에서 바꿔 주세요.

빌드/배포가 필요하면 `npm run build`로 `dist/` 결과물을 생성하고 `npm run preview`로 확인할 수 있습니다.

---

## 2. 주요 npm 스크립트
| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 (자동 새로고침) |
| `npm run build` | 프로덕션 번들 생성 |
| `npm run preview` | 빌드 결과를 로컬에서 미리보기 |

---

## 3. 폴더 구조 (기능 중심)
```
src/
├── app/                      # 전역 App 컨테이너
├── features/
│   ├── auth/                 # 로그인/회원가입 화면
│   ├── home/                 # 대시보드 및 가이드
│   ├── input/                # 회고 입력 단계
│   ├── simulation/           # 대화 시뮬레이션
│   ├── report/               # AI 리포트 표시
│   ├── diary/                # 회고 목록/필터링
│   └── reflection/hooks/     # 전역 상태 관리 훅(useReflectionApp)
├── shared/
│   ├── components/           # 재사용 UI (버튼, 아이콘 등)
│   ├── services/             # 백엔드 fetch, 로컬스토리지 접근
│   └── types.ts              # 공통 타입/열거형
├── assets/                   # 이미지 리소스
└── main.tsx                  # React 진입점
```

- `shared/services/geminiService.ts` 는 백엔드 `/api/reflections/{summary,chat}`를 호출합니다.
- `shared/services/storageService.ts` 가 LocalStorage 관리를 담당해, 컴포넌트는 단순히 훅을 이용하면 됩니다.
- 모든 화면은 `useReflectionApp` 훅에서 제공하는 상태와 액션만 사용하므로 진입 장벽이 낮습니다.

---

## 4. 기능 개요
- **로그인/회원가입**: 브라우저 LocalStorage에 사용자와 회고를 저장하는 데모용 인증
- **홈 화면**: 새로운 회고 시작, 일기 목록 이동, 서비스 사용 가이드 제공
- **회고 입력**: 5단계 폼으로 상황/감정/페르소나 정보를 수집
- **대화 시뮬레이션**: 백엔드와 실시간 대화하며 턴 수 관리 및 연장 기능 제공
- **AI 리포트**: 요약·핵심 인사이트·추천 표현을 카드 형태로 표시, 원하는 경우 일기에 저장
- **다이어리**: 감정 필터와 카드 리스트로 기존 회고를 다시 열람

백엔드만 켜져 있다면 비개발자도 위 설명대로 명령어 몇 개로 프런트를 실행해 체험할 수 있습니다.
