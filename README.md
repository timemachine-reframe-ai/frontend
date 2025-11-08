# TIMEMACHINE AI – 프론트엔드

React + Vite 기반의 싱글 페이지 앱. 
모든 LLM 호출은 FastAPI 백엔드(`/api/reflections/*`)를 통해 처리되기 때문에 브라우저에는 어떤 Gemini 키도 노출되지 않는다.

## 1. 사전 준비
- Node.js 20+
- npm 10+
- 백엔드 서버가 `http://localhost:8000` 등에서 실행 중이어야 함

## 2. 빠른 시작
```bash
cd frontend
npm install
cp .env.example .env
# .env 에서 VITE_BACKEND_URL 을 원하는 주소로 수정
npm run dev
```

- 개발 서버: <http://localhost:3000>
- `VITE_BACKEND_URL` 기본값: `http://localhost:8000`

## 3. npm 스크립트
| 명령 | 설명 |
| --- | --- |
| `npm run dev` | Vite 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드(`dist/`) 생성 |
| `npm run preview` | 빌드 결과 로컬 미리보기 |

## 4. 프로젝트 구조
```
src/
├── App.tsx                  # 화면 상태 머신 및 전역 상태
├── components/BackButton.tsx# 모든 화면에 쓰이는 전역 뒤로가기 버튼
├── screens/                 # Auth/Home/SituationInput/Simulation/Report/Diary
├── services/geminiService.ts# FastAPI 프록시(fetch) 모음
├── types.ts                 # 공통 타입 정의
└── main.tsx                 # 진입점
```

- `services/geminiService.ts`는 `fetch(<VITE_BACKEND_URL>/api/reflections/{summary,chat})`만 호출.
- 시뮬레이션 화면은 `/api/reflections/chat` 응답을 그대로 렌더링해 “상대방 역할의 AI”와 대화하는 느낌을 제공.
- 리포트 화면은 `/api/reflections/summary` 응답을 카드형 UI로 보여주고 JSON 잔여물이 남지 않도록 후처리.

## 5. UX 특징
- 좌상단 **전역 뒤로가기 버튼**으로 모든 화면에서 동일한 내비게이션 제공
- 시뮬레이션 헤더에 페르소나 이름/말투/성격 노출 → 몰입감을 높여 실제 상대방과 대화하는 느낌
- 프론트는 백엔드만 호출하므로 API 키가 노출되지 않는 보안형 구조

## 6. 백엔드 연동
- `/api/reflections/summary`: 상황 정보를 보내면 요약 · 핵심 인사이트 · 추천 표현 JSON 반환
- `/api/reflections/chat`: 대화 메시지를 보내면 페르소나에 맞춘 답변 반환
- 추가 API가 필요하면 `geminiService.ts`에 fetch 함수를 추가하고 원하는 화면에서 호출하면 됨.
