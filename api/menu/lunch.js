/**
 * POST /api/menu/lunch
 * 점심 메뉴 추천 API
 *
 * Request Body: { scenarioId }
 * Response: JSON (LLM이 생성한 결과)
 */

const { handleCors } = require('../server/lib/cors');
const { getScenarioContext, loadPrompt } = require('../server/lib/loaders');
const { generateJsonResponse } = require('../server/lib/llmJson');

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
    const { scenarioId } = req.body;

    // Validation
    if (!scenarioId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'scenarioId is required'
      });
    }

    // Context 로드 (시나리오 맥락 포함)
    const context = getScenarioContext(scenarioId, 'lunch_recommendation');
    if (!context) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Context not found: ${scenarioId}`
      });
    }

    // Prompt 로드
    const prompt = loadPrompt('menu_lunch');
    if (!prompt) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Prompt file not found'
      });
    }

    // OpenAI API 호출 (맥락만 사용, 추가 입력 없음)
    const result = await generateJsonResponse(prompt, '', context);

    // 성공 응답
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error in /api/menu/lunch:', error);
    return res.status(502).json({
      error: 'Bad Gateway',
      message: 'Failed to generate response from LLM'
    });
  }
};
