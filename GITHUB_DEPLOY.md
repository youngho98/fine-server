# GitHub를 통한 Vercel 배포 가이드

## 1단계: GitHub 저장소 생성 및 푸시

### 1-1. GitHub에서 새 저장소 생성
1. https://github.com 로그인
2. 우측 상단 `+` → `New repository` 클릭
3. Repository 정보 입력:
   - Repository name: `fine-server` (또는 원하는 이름)
   - Description: "직장인 올인원 어시스턴트 백엔드 API"
   - Public 또는 Private 선택
   - **주의**: `Add a README file`, `.gitignore`, `license` 모두 체크하지 않기
4. `Create repository` 클릭

### 1-2. 로컬 Git 초기화 및 푸시

터미널에서 프로젝트 디렉토리로 이동 후:

```bash
cd /Users/mason.yh/Desktop/fine-server

# Git 초기화 (이미 되어있다면 스킵)
git init

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Backend API for office assistant"

# GitHub 저장소 연결 (YOUR_USERNAME를 본인 GitHub 아이디로 변경)
git remote add origin https://github.com/YOUR_USERNAME/fine-server.git

# 푸시
git branch -M main
git push -u origin main
```

### 1-3. 푸시 확인
GitHub 저장소 페이지를 새로고침하여 파일들이 올라갔는지 확인

---

## 2단계: Vercel 연동 및 배포

### 2-1. Vercel 회원가입 및 GitHub 연동
1. https://vercel.com 접속
2. `Sign Up` → `Continue with GitHub` 선택
3. GitHub 계정으로 로그인 및 권한 허용

### 2-2. 프로젝트 Import
1. Vercel Dashboard (https://vercel.com/dashboard) 접속
2. `Add New...` → `Project` 클릭
3. `Import Git Repository` 섹션에서 방금 생성한 저장소 찾기
   - 보이지 않으면 `Adjust GitHub App Permissions` 클릭하여 권한 추가
4. 저장소 옆 `Import` 버튼 클릭

### 2-3. 프로젝트 설정
Import 후 설정 화면에서:

**Configure Project 화면:**
- **Project Name**: `fine-server` (또는 원하는 이름)
- **Framework Preset**: `Other` (자동 감지됨)
- **Root Directory**: `./` (기본값)
- **Build Command**: 비워두기
- **Output Directory**: 비워두기

**Environment Variables 추가:**

`Environment Variables` 섹션 펼치기:

1. **OPENAI_API_KEY**
   - Name: `OPENAI_API_KEY`
   - Value: (본인의 OpenAI API 키 입력)
   - Environments: 3개 모두 체크 (Production, Preview, Development)
   - `Add` 버튼 클릭

2. **FRONTEND_ORIGIN**
   - Name: `FRONTEND_ORIGIN`
   - Value: (프론트엔드 배포 주소, 예: `https://your-frontend.vercel.app`)
   - 또는 로컬 테스트용: `http://localhost:3000`
   - Environments: 3개 모두 체크
   - `Add` 버튼 클릭

### 2-4. 배포 시작
- `Deploy` 버튼 클릭
- 배포 진행 상황 확인 (약 1-2분 소요)

### 2-5. 배포 완료
- ✅ 성공 시 `Congratulations!` 화면 표시
- 배포된 URL 확인 (예: `https://fine-server-abc123.vercel.app`)

---

## 3단계: API 테스트

### 배포된 API 테스트

터미널에서 cURL로 테스트:

```bash
# YOUR_DOMAIN을 실제 배포된 도메인으로 변경
curl -X POST https://YOUR_DOMAIN.vercel.app/api/menu/lunch \
  -H "Content-Type: application/json" \
  -d '{"scenarioId": "demo_office"}'
```

정상 응답 예시:
```json
{
  "title": "점심 메뉴 추천",
  "summary": "박미식 과장님을 위한 맞춤 메뉴 추천",
  "result": {
    "text": "...",
    "items": ["제육볶음", "불고기", "비빔밥"],
    "pick": "제육볶음"
  }
}
```

---

## 4단계: 프론트엔드에서 연동

프론트엔드 코드에서 배포된 백엔드 URL 사용:

```javascript
// API Base URL을 배포된 도메인으로 설정
const API_BASE = 'https://YOUR_DOMAIN.vercel.app/api';

// 예시: 점심 메뉴 추천 호출
async function getLunchRecommendation() {
  const response = await fetch(`${API_BASE}/menu/lunch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      scenarioId: 'demo_office'
    })
  });
  
  return response.json();
}
```

---

## 5단계: 코드 수정 후 재배포

### 자동 배포 (GitHub 연동 시)
코드 수정 후 GitHub에 푸시하면 **자동으로 재배포**됩니다:

```bash
# 코드 수정 후
git add .
git commit -m "Update API logic"
git push origin main
```

Vercel이 자동으로 감지하여 재배포 시작!

### 수동 재배포
Vercel Dashboard → Deployments → 최신 배포 → `Redeploy` 버튼

---

## 환경 변수 수정

배포 후 환경 변수를 변경해야 한다면:

1. Vercel Dashboard → 프로젝트 선택
2. `Settings` → `Environment Variables`
3. 변경할 변수 찾아서 `Edit` 또는 `Delete`
4. 변경 후 **반드시 재배포** 필요:
   - Deployments → 최신 배포 → `Redeploy`

---

## 도메인 설정 (선택사항)

커스텀 도메인 연결하기:

1. Vercel Dashboard → 프로젝트 → `Settings` → `Domains`
2. 도메인 입력 (예: `api.yourdomain.com`)
3. DNS 설정 안내에 따라 도메인 업체에서 레코드 추가
4. 완료 후 HTTPS 자동 적용

---

## 배포 상태 확인

### Vercel Dashboard
- https://vercel.com/dashboard
- 프로젝트 클릭 → Deployments 탭에서 배포 이력 확인

### 배포 로그 확인
1. Deployments → 특정 배포 클릭
2. `Building` → `Deployment Logs` 확인
3. 에러 발생 시 로그에서 원인 파악

---

## 트러블슈팅

### 1. 배포는 성공했지만 API 호출 시 502 에러
**원인**: 환경 변수 미설정 또는 잘못된 OpenAI API 키

**해결**:
1. Settings → Environment Variables에서 `OPENAI_API_KEY` 확인
2. API 키가 유효한지 확인 (https://platform.openai.com/api-keys)
3. 변수 수정 후 재배포

### 2. CORS 에러
**원인**: `FRONTEND_ORIGIN`이 프론트엔드 실제 도메인과 다름

**해결**:
1. Settings → Environment Variables에서 `FRONTEND_ORIGIN` 확인
2. 프론트엔드 배포 URL과 정확히 일치하는지 확인 (프로토콜 포함)
3. 예: `https://my-frontend.vercel.app` (끝에 `/` 없이)

### 3. 빌드 실패
**원인**: package.json 의존성 문제

**해결**:
1. 로컬에서 `npm install` 정상 작동하는지 확인
2. `package-lock.json`도 함께 커밋되었는지 확인
3. Deployment Logs에서 구체적인 에러 확인

### 4. GitHub 저장소가 Vercel에 안 보임
**원인**: GitHub App 권한 부족

**해결**:
1. Import 화면에서 `Adjust GitHub App Permissions` 클릭
2. 해당 저장소 체크박스 선택
3. `Save` 후 다시 Import

---

## 유용한 링크

- **Vercel Dashboard**: https://vercel.com/dashboard
- **배포 상태**: https://vercel.com/[username]/fine-server
- **Deployment Logs**: Dashboard → 프로젝트 → Deployments → 특정 배포 클릭
- **Environment Variables**: Dashboard → 프로젝트 → Settings → Environment Variables
- **Domains**: Dashboard → 프로젝트 → Settings → Domains

---

## 요약: 한 번에 보기

```bash
# 1. GitHub 저장소 생성 (웹에서)

# 2. Git 푸시
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/fine-server.git
git push -u origin main

# 3. Vercel에서 Import
# - GitHub 연동
# - 저장소 Import
# - 환경 변수 설정 (OPENAI_API_KEY, FRONTEND_ORIGIN)
# - Deploy 클릭

# 4. 배포 완료 후 테스트
curl -X POST https://YOUR_DOMAIN.vercel.app/api/menu/lunch \
  -H "Content-Type: application/json" \
  -d '{"scenarioId": "demo_office"}'

# 5. 이후 업데이트는 git push만 하면 자동 배포
git add .
git commit -m "Update"
git push
```

끝!
