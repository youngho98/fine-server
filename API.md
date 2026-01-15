# API 명세서

Base URL: `https://YOUR-DOMAIN.vercel.app`

## 공통 사항

### 응답 형식
모든 API는 JSON 형식으로 응답합니다.

### 성공 응답 구조
```json
{
  "title": "기능 제목",
  "summary": "한 줄 요약",
  "result": {
    "text": "상세 설명 텍스트",
    "items": ["항목1", "항목2", "항목3"],
    "pick": "최종 추천 (메뉴 API만 해당)"
  }
}
```

### 에러 응답 구조
```json
{
  "error": "Error Type",
  "message": "에러 상세 메시지"
}
```

### HTTP 상태 코드
- `200`: 성공
- `400`: 잘못된 요청 (필수 파라미터 누락)
- `404`: 리소스를 찾을 수 없음 (잘못된 scenarioId)
- `405`: 허용되지 않는 메서드
- `500`: 서버 내부 오류
- `502`: LLM 응답 생성 실패

---

## 1. 점심 메뉴 추천

### Endpoint
```
POST /api/menu/lunch
```

### Request Body
```json
{
  "scenarioId": "demo_office"
}
```

### Request 파라미터
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| scenarioId | string | O | 시나리오 ID (현재 "demo_office"만 지원) |

### Response
```json
{
  "title": "점심 메뉴 추천",
  "summary": "박미식 과장님을 위한 맞춤 메뉴 추천",
  "result": {
    "text": "과장님이 밥 종류를 선호하신다는 점을 고려하여 추천드립니다. 김치찌개는 어제 드셨고, 수제비는 속이 더부룩하실 수 있으니 제외했습니다. 날씨가 쌀쌀한 점을 고려하여 따뜻하고 든든한 메뉴로 선정했습니다.",
    "items": ["제육볶음", "불고기", "비빔밥"],
    "pick": "제육볶음"
  }
}
```

### 동작 방식
- 기존 대화 맥락(`lunch_recommendation` 시나리오)을 바탕으로 메뉴 추천
- 사용자의 추가 입력 없이 맥락만으로 AI가 판단
- 박미식 과장과의 대화 내용 분석 후 추천

### cURL 예제
```bash
curl -X POST https://YOUR-DOMAIN.vercel.app/api/menu/lunch \
  -H "Content-Type: application/json" \
  -d '{"scenarioId": "demo_office"}'
```

---

## 2. 회식 메뉴 추천

### Endpoint
```
POST /api/menu/dining
```

### Request Body
```json
{
  "scenarioId": "demo_office"
}
```

### Request 파라미터
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| scenarioId | string | O | 시나리오 ID (현재 "demo_office"만 지원) |

### Response
```json
{
  "title": "회식 메뉴 추천",
  "summary": "9명 룸 가능한 3만원 이하 회식 장소",
  "result": {
    "text": "9명이 입장 가능한 룸이 있는 곳으로 추천드립니다. 인당 3만원 예산을 고려하여 합리적인 가격대의 메뉴를 선정했습니다. 유대리님이 준비하신 와인과도 잘 어울리는 분위기의 장소입니다.",
    "items": ["고기집", "이탈리안 레스토랑", "해산물 요리"],
    "pick": "이탈리안 레스토랑"
  }
}
```

### 동작 방식
- 기존 대화 맥락(`dining_recommendation` 시나리오)을 바탕으로 회식 장소 추천
- 최짠물 팀장과의 대화에서 언급된 조건(9명, 룸, 3만원 이하) 반영
- 사용자 추가 입력 없이 맥락만으로 판단

### cURL 예제
```bash
curl -X POST https://YOUR-DOMAIN.vercel.app/api/menu/dining \
  -H "Content-Type: application/json" \
  -d '{"scenarioId": "demo_office"}'
```

---

## 3. 메시지 정중화 (사과문 워싱)

### Endpoint
```
POST /api/message/apology
```

### Request Body
```json
{
  "scenarioId": "demo_office",
  "input": "죄송합니다 지금 데이터 취합 중인데 금방 드리겠습니다"
}
```

### Request 파라미터
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| scenarioId | string | O | 시나리오 ID (현재 "demo_office"만 지원) |
| input | string | O | 정중화할 원본 메시지 |

### Response
```json
{
  "title": "메시지 정중화",
  "summary": "비즈니스 상황에 적합하게 다듬었습니다",
  "result": {
    "text": "팀장님, 현재 경쟁사 분석 자료를 최종 검토 중이며 2시 이전에 공유드리겠습니다. 조금만 기다려주시면 감사하겠습니다.",
    "items": [
      "현재 자료 정리 중이며 곧 전달드리겠습니다.",
      "최종 확인 작업을 진행 중이니 잠시만 기다려주시기 바랍니다.",
      "보고 자료 준비가 거의 완료되었으며 곧 공유드리겠습니다."
    ]
  }
}
```

### 동작 방식
- 기존 대화 맥락(`apology_filter` 시나리오) + 사용자 입력 메시지 결합
- 강수형 팀장과의 상황을 고려하여 정중하고 프로페셔널하게 변환
- 원문의 의도는 유지하되 비즈니스 상황에 적합한 표현으로 개선

### cURL 예제
```bash
curl -X POST https://YOUR-DOMAIN.vercel.app/api/message/apology \
  -H "Content-Type: application/json" \
  -d '{
    "scenarioId": "demo_office",
    "input": "죄송합니다 지금 데이터 취합 중인데 금방 드리겠습니다"
  }'
```

---

## 4. 직무 간 통역

### Endpoint
```
POST /api/translate/role
```

### Request Body
```json
{
  "scenarioId": "demo_office",
  "input": "레거시 코드가 너무 꼬여 있어서 하드코딩해야 하는데, 그럼 나중에 유지보수 안 돼요."
}
```

### Request 파라미터
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| scenarioId | string | O | 시나리오 ID (현재 "demo_office"만 지원) |
| input | string | O | 통역할 전문 용어/문장 |

### Response
```json
{
  "title": "직무 간 통역",
  "summary": "기획자도 이해할 수 있는 쉬운 설명",
  "result": {
    "text": "기존에 작성된 코드가 복잡하게 얽혀있어서, 임시방편으로 코드를 추가하는 방법밖에 없습니다. 하지만 이렇게 하면 나중에 문제가 생겼을 때 고치기가 매우 어려워집니다.",
    "items": [
      "기획 관점: 기능을 추가하려면 기존 시스템을 수정해야 하는데, 구조가 복잡해서 임시로 붙이는 방법밖에 없어요. 나중에 수정이 어려워질 수 있습니다.",
      "개발 관점: 레거시 코드의 의존성이 높아서 리팩토링 없이는 하드코딩으로 대응할 수밖에 없습니다. 기술 부채가 쌓일 것으로 예상됩니다.",
      "디자인 관점: 기존 디자인 시스템과 연결하기 어려워서 별도로 작업해야 합니다. 일관성이 떨어질 수 있어요."
    ]
  }
}
```

### 동작 방식
- 기존 대화 맥락(`role_translator` 시나리오) + 사용자 입력 문장
- 송해 PM과의 대화 상황을 반영하여 비개발자도 이해할 수 있게 설명
- 기획/개발/디자인 각 직무 관점에서 설명 제공

### cURL 예제
```bash
curl -X POST https://YOUR-DOMAIN.vercel.app/api/translate/role \
  -H "Content-Type: application/json" \
  -d '{
    "scenarioId": "demo_office",
    "input": "레거시 코드가 너무 꼬여 있어서 하드코딩해야 하는데, 그럼 나중에 유지보수 안 돼요."
  }'
```

---

## 시나리오 컨텍스트 구조

### demo_office.json
각 API는 `server/contexts/demo_office.json`의 해당 시나리오를 참조합니다:

```json
{
  "persona": {
    "name": "영호",
    "tone": "친근하지만 예의 있는 존댓말",
    "job": "직장인"
  },
  "scenarios": {
    "lunch_recommendation": {
      "chatHistory": [
        {
          "speaker": "박미식 과장님",
          "message": "김 사원, 오늘 점심 뭐 먹을까? 난 아무거나 괜찮아~",
          "timestamp": "2026-01-15 11:20"
        },
        ...
      ]
    },
    "dining_recommendation": { ... },
    "apology_filter": { ... },
    "role_translator": { ... }
  }
}
```

---

## 추가 정보

### Rate Limiting
현재 Rate Limiting 없음 (필요시 Vercel Pro 플랜에서 설정 가능)

### 캐싱
응답은 캐싱되지 않음 (매번 새로운 AI 응답 생성)

### 타임아웃
- 최대 30초 (vercel.json에서 설정)
- OpenAI API 응답이 느릴 경우 타임아웃 발생 가능

### CORS
- `FRONTEND_ORIGIN` 환경 변수에 설정된 도메인만 허용
- Preflight OPTIONS 요청 지원

### 보안
- API 키는 서버 환경 변수로 관리
- 클라이언트에 노출되지 않음
