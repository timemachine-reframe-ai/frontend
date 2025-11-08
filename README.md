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
# 백엔드 주소 설정 (예: http://localhost:8000)
npm run dev
```

기본 개발 서버는 http://localhost:3000 에서 동작합니다.

| 환경 변수 | 설명 |
| --- | --- |
| `VITE_BACKEND_URL` | FastAPI 백엔드의 베이스 URL (예: `http://localhost:8000`) |

## npm 스크립트
| 명령 | 설명 |
| --- | --- |
| `npm run dev` | Vite 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드를 `dist/`에 생성 |
| `npm run preview` | 빌드 결과를 로컬에서 미리보기 |

## 백엔드 연동 팁
- 모든 Gemini 호출은 FastAPI(`/api/reflections/*`)를 통해 이뤄지므로, 프론트에는 어떤 키도 저장하지 않습니다.
- API 호출 로직은 `src/services/geminiService.ts`에서 관리하며 `VITE_BACKEND_URL`을 통해 베이스 URL을 주입합니다.

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
