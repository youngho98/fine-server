/**
 * POST /api/message/apology
 * 비즈니스 메시지 정중화 (사과문 워싱) API
 *
 * Request Body: { scenarioId, input }
 * Response: JSON (LLM이 생성한 결과)
 */

const { handleCors } = require('./server/lib/cors');
const { getScenarioContext, loadPrompt } = require('./server/lib/loaders');
const { generateJsonResponse } = require('./server/lib/llmJson');

module.exports = async (req, res) => {
  // CORS 처리 및 OPTIONS preflight 응답
  if (handleCors(req, res)) {
    return;
  }

  // POST 메서드만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { scenarioId, input } = req.body;

    // Validation
    if (!scenarioId || !input) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'scenarioId and input are required'
      });
    }

    // Context 로드 (시나리오 맥락 포함)
    const context = getScenarioContext(scenarioId, 'apology_filter');
    if (!context) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Context not found: ${scenarioId}`
      });
    }

    // Prompt 로드
    const prompt = loadPrompt('apology');
    if (!prompt) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Prompt file not found'
      });
    }

    // OpenAI API 호출
    const result = await generateJsonResponse(prompt, input, context);

    // 성공 응답
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error in /api/message/apology:', error);
    return res.status(502).json({
      error: 'Bad Gateway',
      message: 'Failed to generate response from LLM'
    });
  }
};
