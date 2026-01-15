/**
 * OpenAI 클라이언트 초기화
 *
 * OpenAI 공식 Node SDK 사용
 * OPENAI_API_KEY 환경변수 필수
 */

const OpenAI = require('openai');

// 싱글톤 인스턴스
let openaiClient = null;

/**
 * OpenAI 클라이언트 인스턴스 반환
 * 처음 호출 시에만 초기화되며, 이후 호출에서는 캐시된 인스턴스 반환
 * @returns {OpenAI} OpenAI 클라이언트 인스턴스
 * @throws {Error} OPENAI_API_KEY가 설정되지 않은 경우
 */
function getOpenAIClient() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    openaiClient = new OpenAI({
      apiKey: apiKey,
    });

    console.log('OpenAI client initialized');
  }

  return openaiClient;
}

module.exports = { getOpenAIClient };
