# TIMEMACHINE AI – 프론트엔드

Vite + React 기반의 TIMEMACHINE AI 클라이언트입니다. 이 디렉터리가 현재 기준이 되는 프론트엔드 저장소입니다.

## 준비물
- Node.js 20+
- npm 10+

## 빠른 시작
```bash
cd frontend
npm install
cp .env.example .env
# VITE_GEMINI_API_KEY (및 필요시 VITE_GEMINI_MODEL) 입력
npm run dev
```

기본 개발 서버는 http://localhost:3000 에서 동작합니다.

| 환경 변수 | 설명 |
| --- | --- |
| `VITE_GEMINI_API_KEY` | 필수. `@google/genai` 클라이언트에 주입되는 API 키 |
| `VITE_GEMINI_MODEL` | 선택. 기본값은 `gemini-2.5-flash` |

## npm 스크립트
| 명령 | 설명 |
| --- | --- |
| `npm run dev` | Vite 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드를 `dist/`에 생성 |
| `npm run preview` | 빌드 결과를 로컬에서 미리보기 |

## 백엔드 연동 팁
- API URL 변경이나 신규 호출은 `src/services/`에서 관리합니다.
- FastAPI 주소를 환경 변수로 관리하고 싶다면 `.env`에 `VITE_API_BASE_URL=http://localhost:8000/api` 같은 값을 추가하세요.

## 프로젝트 구조
```
src/
├── App.tsx              # 화면 상태머신 및 전체 레이아웃
├── components/          # 공용 UI 컴포넌트(아이콘 등)
├── screens/             # Auth/Home/Diary/Simulation/Report 화면
├── services/            # Gemini 관련 서비스 로직
├── types.ts             # 공통 타입/열거형
└── main.tsx             # 진입점
```

정적 자산과 메타데이터는 `public/`에 위치하며, Tailwind CDN 등 전역 스크립트는 `index.html`에서 관리합니다.
