# API 명세서

**Base URL**: `https://fine-server.vercel.app`

---

## 📌 개요

총 **4개**의 API 엔드포인트 제공

| API | Method | Endpoint | Input 필요 여부 |
|-----|--------|----------|----------------|
| 점심 메뉴 추천 | POST | `/api/menu/lunch` | ❌ (맥락만 사용) |
| 회식 메뉴 추천 | POST | `/api/menu/dining` | ❌ (맥락만 사용) |
| 메시지 정중화 | POST | `/api/message/apology` | ✅ |
| 직무 간 통역 | POST | `/api/translate/role` | ✅ |

---

## 📋 공통 응답 형식

### 성공 응답 (200)
```json
{
  "title": "기능 제목",
  "summary": "한 줄 요약",
  "result": {
    "text": "상세 설명",
    "items": ["항목1", "항목2", "항목3"],
    "pick": "최종 추천" // 메뉴 API만
  }
}
```

### 에러 응답
```json
{
  "error": "에러 타입",
  "message": "에러 상세 메시지"
}
```

### HTTP 상태 코드
- `200`: 성공
- `400`: 잘못된 요청 (필수 파라미터 누락)
- `404`: 리소스 없음 (잘못된 scenarioId)
- `405`: 허용되지 않는 메서드 (POST만 허용)
- `500`: 서버 내부 오류
- `502`: LLM 응답 생성 실패

---

## 1️⃣ 점심 메뉴 추천

### `POST /api/menu/lunch`

대화 맥락만으로 점심 메뉴를 추천합니다.

#### Request
```json
{
  "scenarioId": "demo_office"
}
```

#### Parameters
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| scenarioId | string | ✅ | 시나리오 ID (현재 "demo_office"만 지원) |

#### Response Example
```json
{
  "title": "점심 메뉴 추천",
  "summary": "박미식 과장님을 위한 맞춤 메뉴",
  "result": {
    "text": "과장님이 밥 종류를 선호하신다는 점을 고려했습니다. 김치찌개는 어제 드셨고 수제비는 속이 더부룩하실 수 있으니 제외했습니다.",
    "items": ["제육볶음", "불고기", "비빔밥"],
    "pick": "제육볶음"
  }
}
```

#### cURL
```bash
curl -X POST https://fine-server.vercel.app/api/menu/lunch \
  -H "Content-Type: application/json" \
  -d '{"scenarioId":"demo_office"}'
```

#### JavaScript
```javascript
const response = await fetch('https://fine-server.vercel.app/api/menu/lunch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ scenarioId: 'demo_office' })
});
const data = await response.json();
```

---

## 2️⃣ 회식 메뉴 추천

### `POST /api/menu/dining`

대화 맥락만으로 회식 장소를 추천합니다.

#### Request
```json
{
  "scenarioId": "demo_office"
}
```

#### Parameters
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| scenarioId | string | ✅ | 시나리오 ID (현재 "demo_office"만 지원) |

#### Response Example
```json
{
  "title": "회식 메뉴 추천",
  "summary": "9명 룸 가능한 3만원 이하 장소",
  "result": {
    "text": "9명이 입장 가능한 룸이 있고 인당 3만원 예산에 맞는 장소를 추천합니다.",
    "items": ["고기집", "이탈리안 레스토랑", "해산물 요리"],
    "pick": "이탈리안 레스토랑"
  }
}
```

#### cURL
```bash
curl -X POST https://fine-server.vercel.app/api/menu/dining \
  -H "Content-Type: application/json" \
  -d '{"scenarioId":"demo_office"}'
```

#### JavaScript
```javascript
const response = await fetch('https://fine-server.vercel.app/api/menu/dining', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ scenarioId: 'demo_office' })
});
const data = await response.json();
```

---

## 3️⃣ 메시지 정중화

### `POST /api/message/apology`

원본 메시지를 비즈니스에 적합하게 정중하게 변환합니다.

#### Request
```json
{
  "scenarioId": "demo_office",
  "input": "죄송합니다 지금 데이터 취합 중인데 금방 드리겠습니다"
}
```

#### Parameters
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| scenarioId | string | ✅ | 시나리오 ID |
| input | string | ✅ | 정중화할 원본 메시지 |

#### Response Example
```json
{
  "title": "메시지 정중화",
  "summary": "비즈니스 상황에 적합하게 다듬었습니다",
  "result": {
    "text": "팀장님, 현재 경쟁사 분석 자료를 최종 검토 중이며 2시 이전에 공유드리겠습니다.",
    "items": [
      "현재 자료 정리 중이며 곧 전달드리겠습니다.",
      "최종 확인 작업을 진행 중이니 잠시만 기다려주시기 바랍니다.",
      "보고 자료 준비가 거의 완료되었으며 곧 공유드리겠습니다."
    ]
  }
}
```

#### cURL
```bash
curl -X POST https://fine-server.vercel.app/api/message/apology \
  -H "Content-Type: application/json" \
  -d '{
    "scenarioId": "demo_office",
    "input": "죄송합니다 지금 데이터 취합 중인데 금방 드리겠습니다"
  }'
```

#### JavaScript
```javascript
const response = await fetch('https://fine-server.vercel.app/api/message/apology', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    scenarioId: 'demo_office',
    input: '죄송합니다 지금 데이터 취합 중인데 금방 드리겠습니다'
  })
});
const data = await response.json();
```

---

## 4️⃣ 직무 간 통역

### `POST /api/translate/role`

전문 용어를 쉬운 말로 번역하고 직무별 관점에서 설명합니다.

#### Request
```json
{
  "scenarioId": "demo_office",
  "input": "레거시 코드가 너무 꼬여 있어서 하드코딩해야 하는데, 그럼 나중에 유지보수 안 돼요."
}
```

#### Parameters
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| scenarioId | string | ✅ | 시나리오 ID |
| input | string | ✅ | 통역할 전문 용어/문장 |

#### Response Example
```json
{
  "title": "직무 간 통역",
  "summary": "기획자도 이해할 수 있는 설명",
  "result": {
    "text": "기존 코드가 복잡하게 얽혀있어서 임시방편으로 추가하는 방법밖에 없습니다. 나중에 수정하기 어려워집니다.",
    "items": [
      "기획 관점: 기능을 추가하려면 기존 시스템을 수정해야 하는데 구조가 복잡해서 임시로 붙이는 방법밖에 없어요.",
      "개발 관점: 레거시 코드의 의존성이 높아서 하드코딩으로 대응할 수밖에 없습니다. 기술 부채가 쌓일 것입니다.",
      "디자인 관점: 기존 디자인 시스템과 연결하기 어려워서 별도로 작업해야 합니다."
    ]
  }
}
```

#### cURL
```bash
curl -X POST https://fine-server.vercel.app/api/translate/role \
  -H "Content-Type: application/json" \
  -d '{
    "scenarioId": "demo_office",
    "input": "레거시 코드가 너무 꼬여 있어서 하드코딩해야 하는데, 그럼 나중에 유지보수 안 돼요."
  }'
```

#### JavaScript
```javascript
const response = await fetch('https://fine-server.vercel.app/api/translate/role', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    scenarioId: 'demo_office',
    input: '레거시 코드가 너무 꼬여 있어서 하드코딩해야 하는데, 그럼 나중에 유지보수 안 돼요.'
  })
});
const data = await response.json();
```

---

## 🔐 인증

현재 API 키 인증 없음. CORS만 `FRONTEND_ORIGIN` 환경 변수로 제한.

---

## ⚙️ 제한사항

- **Rate Limiting**: 없음 (Vercel 기본 제한만 적용)
- **Max Request Size**: 4.5MB
- **Timeout**: 30초
- **캐싱**: 없음 (매 요청마다 새 AI 응답 생성)

---

## 🐛 에러 처리

### 400 Bad Request
필수 파라미터 누락

```json
{
  "error": "Bad Request",
  "message": "scenarioId and input are required"
}
```

### 404 Not Found
존재하지 않는 scenarioId

```json
{
  "error": "Not Found",
  "message": "Context not found: invalid_scenario"
}
```

### 502 Bad Gateway
OpenAI API 호출 실패 또는 JSON 파싱 실패

```json
{
  "error": "Bad Gateway",
  "message": "Failed to generate response from LLM"
}
```

---

## 📝 참고사항

### scenarioId
현재 `"demo_office"` 시나리오만 지원.
향후 다른 시나리오 추가 가능.

### 대화 맥락
각 API는 `server/contexts/demo_office.json`에 저장된 대화 기록을 참조:
- `lunch_recommendation`: 박미식 과장과의 점심 대화
- `dining_recommendation`: 최짠물 팀장과의 회식 대화
- `apology_filter`: 강수형 팀장과의 보고 상황
- `role_translator`: 송해 PM과의 개발 용어 대화

### AI 모델
OpenAI GPT-4o-mini 사용 (temperature: 0.3)
