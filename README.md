# 직장인 올인원 어시스턴트 백엔드 API

이 프로젝트는 발표용 MVP를 목표로 하며, **안정성, 단순성, 재현성**을 최우선으로 합니다.

## 기술 스택

- **Runtime**: Node.js 18+
- **Language**: JavaScript (CommonJS)
- **Platform**: Vercel Serverless Functions
- **LLM**: OpenAI API (공식 Node SDK)

## 프로젝트 구조

```
/
├─ api/               # Vercel Serverless Functions
│  ├─ menu/
│  │  ├─ lunch.js     # POST /api/menu/lunch
│  │  └─ dining.js    # POST /api/menu/dining
│  ├─ message/
│  │  └─ apology.js   # POST /api/message/apology
│  ├─ translate/
│  │  └─ role.js      # POST /api/translate/role
│  └─ vent/
│     └─ respond.js   # POST /api/vent/respond
│
├─ server/            # 백엔드 전용 모듈
│  ├─ lib/
│  │  ├─ cors.js      # CORS 처리
│  │  ├─ loaders.js   # 컨텍스트/프롬프트 로더
│  │  ├─ openaiClient.js  # OpenAI 클라이언트
│  │  └─ llmJson.js   # LLM JSON 응답 생성
│  ├─ contexts/
│  │  └─ demo_office.json  # 시나리오별 컨텍스트
│  └─ prompts/
│     ├─ menu_lunch.txt
│     ├─ menu_dining.txt
│     ├─ apology.txt
│     ├─ translate_role.txt
│     └─ vent_comfort.txt
│
├─ package.json
├─ vercel.json
└─ claude.md          # 전체 프로젝트 지침
```

## API 엔드포인트

### 공통 Request Body
```json
{
  "scenarioId": "demo_office",
  "input": "사용자 입력 문장"
}
```

### 1. POST /api/menu/lunch
점심 메뉴 추천

### 2. POST /api/menu/dining
회식/저녁 메뉴 추천

### 3. POST /api/message/apology
메시지 정중화 (사과문 워싱)

### 4. POST /api/translate/role
직무/직급 간 통역

### 5. POST /api/vent/respond
멘탈 케어 (감정 위로)

## 환경 변수

`.env` 파일에 다음 환경 변수를 설정하세요:

```bash
OPENAI_API_KEY=your_openai_api_key_here
FRONTEND_ORIGIN=https://your-frontend-domain.vercel.app
```

## 로컬 개발

```bash
# 의존성 설치
npm install

# Vercel CLI로 개발 서버 실행
npx vercel dev
```

## 배포

```bash
# Vercel에 배포
npm run deploy
```

## 주요 특징

- ✅ DB, 세션, 인증 없음
- ✅ 컨텍스트는 서버 JSON 파일로 관리
- ✅ OpenAI API 호출 1회로 결과 생성
- ✅ JSON 전용 응답 형식
- ✅ 발표용 안정성 최적화

## 참고

- 프론트엔드는 별도 프로젝트로 분리
- 백엔드는 순수 API 응답만 담당
- LangChain 사용하지 않음
