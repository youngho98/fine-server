/**
 * 컨텍스트 및 프롬프트 파일 로더 (in-memory 캐시 포함)
 *
 * 발표용 MVP이므로 파일 변경 감지는 하지 않음
 * 서버 재시작 시 캐시 초기화됨
 */

const fs = require('fs');
const path = require('path');

// In-memory 캐시
const cache = {
  contexts: {},
  prompts: {}
};

/**
 * 컨텍스트 JSON 파일 로드
 * @param {string} scenarioId - 시나리오 ID (예: demo_office)
 * @returns {object|null} 파싱된 JSON 객체 또는 null
 */
function loadContext(scenarioId) {
  // 캐시 확인
  if (cache.contexts[scenarioId]) {
    return cache.contexts[scenarioId];
  }

  const contextPath = path.join(process.cwd(), 'contexts', `${scenarioId}.json`);

  if (!fs.existsSync(contextPath)) {
    console.error(`Context not found: ${contextPath}`);
    return null;
  }

  try {
    const data = fs.readFileSync(contextPath, 'utf-8');
    const parsed = JSON.parse(data);

    // 캐시에 저장
    cache.contexts[scenarioId] = parsed;

    return parsed;
  } catch (error) {
    console.error(`Failed to load context [${scenarioId}]:`, error.message);
    return null;
  }
}

/**
 * 프롬프트 텍스트 파일 로드
 * @param {string} promptName - 프롬프트 파일명 (확장자 제외)
 * @returns {string|null} 프롬프트 텍스트 또는 null
 */
function loadPrompt(promptName) {
  // 캐시 확인
  if (cache.prompts[promptName]) {
    return cache.prompts[promptName];
  }

  const promptPath = path.join(process.cwd(), 'prompts', `${promptName}.txt`);

  if (!fs.existsSync(promptPath)) {
    console.error(`Prompt not found: ${promptPath}`);
    return null;
  }

  try {
    const content = fs.readFileSync(promptPath, 'utf-8');

    // 캐시에 저장
    cache.prompts[promptName] = content;

    return content;
  } catch (error) {
    console.error(`Failed to load prompt [${promptName}]:`, error.message);
    return null;
  }
}

/**
 * 특정 시나리오의 맥락 정보 가져오기
 * @param {string} scenarioId - 시나리오 ID (예: demo_office)
 * @param {string} scenarioType - 시나리오 타입 (예: lunch_recommendation)
 * @returns {object|null} 시나리오 맥락 객체 또는 null
 */
function getScenarioContext(scenarioId, scenarioType) {
  const context = loadContext(scenarioId);

  if (!context) {
    return null;
  }

  // 시나리오 맥락이 있으면 기본 컨텍스트에 포함
  if (context.scenarios && context.scenarios[scenarioType]) {
    return {
      ...context,
      currentScenario: context.scenarios[scenarioType]
    };
  }

  // 시나리오 맥락이 없어도 기본 컨텍스트는 반환
  return context;
}

/**
 * 캐시 초기화 (테스트용)
 */
function clearCache() {
  cache.contexts = {};
  cache.prompts = {};
}

module.exports = { loadContext, loadPrompt, getScenarioContext, clearCache };
