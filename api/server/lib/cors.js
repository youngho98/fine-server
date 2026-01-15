/**
 * CORS 헤더 설정 및 preflight 처리
 *
 * FRONTEND_ORIGIN 환경변수에 설정된 도메인만 허용
 * OPTIONS 요청은 200으로 즉시 응답
 */

/**
 * CORS 헤더 설정
 * @param {object} res - Vercel response 객체
 */
function setCorsHeaders(res) {
  const allowedOrigin = process.env.FRONTEND_ORIGIN || '*';

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
}

/**
 * CORS 처리 및 preflight 요청 핸들링
 * @param {object} req - Vercel request 객체
 * @param {object} res - Vercel response 객체
 * @returns {boolean} preflight 요청이면 true, 아니면 false
 */
function handleCors(req, res) {
  setCorsHeaders(res);

  // OPTIONS preflight 요청 처리
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}

module.exports = { handleCors, setCorsHeaders };
