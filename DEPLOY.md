# Vercel 배포 가이드

## 사전 준비

1. **Vercel 계정 생성**
   - https://vercel.com 에서 회원가입
   - GitHub 계정 연동 권장

2. **OpenAI API 키 발급**
   - https://platform.openai.com/api-keys 에서 API 키 생성
   - 결제 수단 등록 필요

## 배포 방법

### 방법 1: Vercel CLI로 배포 (권장)

1. **Vercel CLI 설치 및 로그인**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **프로젝트 루트에서 배포**
   ```bash
   cd fine-server
   vercel
   ```

3. **초기 설정 질문 답변**
   - `Set up and deploy "~/Desktop/fine-server"?` → **Y**
   - `Which scope do you want to deploy to?` → 본인 계정 선택
   - `Link to existing project?` → **N** (첫 배포시)
   - `What's your project's name?` → **fine-server** (또는 원하는 이름)
   - `In which directory is your code located?` → **./** (엔터)

4. **환경 변수 설정**
   ```bash
   vercel env add OPENAI_API_KEY
   ```
   - 프롬프트에 OpenAI API 키 입력
   - `Which Environments?` → **Production, Preview, Development** (스페이스바로 선택)

   ```bash
   vercel env add FRONTEND_ORIGIN
   ```
   - 프론트엔드 배포 주소 입력 (예: `https://your-frontend.vercel.app`)
   - 같은 방식으로 환경 설정

5. **프로덕션 배포**
   ```bash
   vercel --prod
   ```

6. **배포 완료**
   - 터미널에 출력된 URL 확인 (예: `https://fine-server.vercel.app`)
   - 이 URL이 백엔드 API 베이스 URL입니다

### 방법 2: Vercel Dashboard에서 배포

1. **GitHub에 프로젝트 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/fine-server.git
   git push -u origin main
   ```

2. **Vercel Dashboard에서 Import**
   - https://vercel.com/new 접속
   - GitHub 저장소 선택
   - Import 클릭

3. **환경 변수 설정**
   - Settings → Environment Variables로 이동
   - 다음 변수 추가:
     - `OPENAI_API_KEY`: OpenAI API 키
     - `FRONTEND_ORIGIN`: 프론트엔드 배포 주소
   - Environment: Production, Preview, Development 모두 체크

4. **Deploy 버튼 클릭**

## 배포 후 확인

### 1. API 엔드포인트 테스트

점심 메뉴 추천 API 테스트:
```bash
curl -X POST https://YOUR-DOMAIN.vercel.app/api/menu/lunch \
  -H "Content-Type: application/json" \
  -d '{"scenarioId": "demo_office"}'
```

정상 응답 예시:
```json
{
  "title": "점심 메뉴 추천",
  "summary": "박미식 과장님을 위한 맞춤 메뉴 추천",
  "result": {
    "text": "과장님이 밥 종류를 원하신다는 점을 고려하여...",
    "items": ["제육볶음", "불고기", "비빔밥"],
    "pick": "제육볶음"
  }
}
```

### 2. 로그 확인

```bash
vercel logs YOUR-DOMAIN.vercel.app
```

또는 Vercel Dashboard → Deployments → 최근 배포 → Logs

### 3. 배포 URL 확인

```bash
vercel ls
```

## 재배포

코드 수정 후 재배포:

```bash
vercel --prod
```

또는 GitHub 푸시 시 자동 배포 (Dashboard 연동 시)

## 환경 변수 관리

### 환경 변수 조회
```bash
vercel env ls
```

### 환경 변수 삭제
```bash
vercel env rm OPENAI_API_KEY production
```

### 환경 변수 수정
기존 변수 삭제 후 다시 추가:
```bash
vercel env rm OPENAI_API_KEY production
vercel env add OPENAI_API_KEY production
```

## 도메인 설정 (선택)

1. Vercel Dashboard → 프로젝트 → Settings → Domains
2. 커스텀 도메인 입력 (예: `api.mydomain.com`)
3. DNS 레코드 설정 지침 따라 진행

## 트러블슈팅

### 1. 502 Bad Gateway 에러
- OpenAI API 키가 올바르게 설정되었는지 확인
- Vercel Dashboard → Settings → Environment Variables에서 키 확인
- 배포 후 재시작 필요: 코드 수정 없이 `vercel --prod` 재실행

### 2. 404 Not Found
- API 경로가 올바른지 확인 (`/api/menu/lunch`)
- vercel.json 설정 확인

### 3. CORS 에러
- FRONTEND_ORIGIN 환경 변수가 정확한지 확인
- 프론트엔드 실제 배포 주소와 일치해야 함
- 프로토콜(https://)과 포트까지 정확히 입력

### 4. 환경 변수가 반영되지 않음
- 환경 변수 추가 후 반드시 재배포 필요
- `vercel --prod` 다시 실행

## 유용한 명령어

```bash
# 배포 상태 확인
vercel ls

# 특정 배포 정보
vercel inspect YOUR-DEPLOYMENT-URL

# 배포 제거
vercel rm fine-server

# 프로젝트 정보
vercel project ls
```

## 비용

- Vercel Hobby 플랜: 무료
  - 월 100GB 대역폭
  - Serverless Functions 실행 시간 100시간
  - 개인 프로젝트에 충분

- OpenAI API: 사용량 기준 과금
  - GPT-4o-mini: 매우 저렴
  - 예상 비용: 월 $1~5 (테스트/발표용)

## 참고 링크

- Vercel 공식 문서: https://vercel.com/docs
- Vercel CLI 문서: https://vercel.com/docs/cli
- Serverless Functions: https://vercel.com/docs/functions/serverless-functions
