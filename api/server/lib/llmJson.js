/**
 * LLM을 이용한 JSON 생성 (1회 재시도 포함)
 *
 * OpenAI API 호출 시:
 * - model: gpt-4o-mini (빠르고 안정적)
 * - temperature: 0.3 (일관성 우선)
 * - response_format: json_object (JSON만 강제)
 *
 * JSON 파싱 실패 시 1회 재시도
 * 재시도도 실패하면 에러 throw
 */

const { getOpenAIClient } = require('./openaiClient');

/**
 * OpenAI API를 호출하여 JSON 응답을 받아옴
 * @param {string} systemPrompt - 시스템 프롬프트 (프롬프트 파일 내용)
 * @param {string} userMessage - 사용자 메시지 (입력 문장)
 * @param {object} context - 컨텍스트 객체 (persona, foodProfile 등)
 * @returns {Promise<object>} 파싱된 JSON 객체
 * @throws {Error} JSON 생성 실패 또는 파싱 실패 시
 */
async function generateJsonResponse(systemPrompt, userMessage, context) {
  const client = getOpenAIClient();

  // 컨텍스트를 문자열로 변환
  const contextStr = JSON.stringify(context, null, 2);

  // 사용자 메시지에 컨텍스트 포함
  const fullUserMessage = `[컨텍스트]\n${contextStr}\n\n[사용자 입력]\n${userMessage}`;

  try {
    // 첫 번째 시도
    console.log('OpenAI API 호출 시작 (첫 번째 시도)');

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: fullUserMessage }
      ],
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    console.log('OpenAI 응답 수신 완료');

    // JSON 파싱
    const parsed = JSON.parse(content);
    console.log('JSON 파싱 성공');

    return parsed;
  } catch (error) {
    console.error('첫 번째 시도 실패:', error.message);

    // 재시도
    try {
      console.log('OpenAI API 재시도 시작');

      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: fullUserMessage }
        ],
        response_format: { type: 'json_object' }
      });

      const content = completion.choices[0].message.content;
      console.log('OpenAI 재시도 응답 수신 완료');

      // JSON 파싱
      const parsed = JSON.parse(content);
      console.log('JSON 파싱 성공 (재시도)');

      return parsed;
    } catch (retryError) {
      console.error('재시도도 실패:', retryError.message);
      throw new Error(`Failed to generate valid JSON response after retry: ${retryError.message}`);
    }
  }
}

module.exports = { generateJsonResponse };
