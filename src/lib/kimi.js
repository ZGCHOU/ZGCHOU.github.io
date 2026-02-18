// 彻底去掉 URL 末尾的空格！
const KIMI_API_BASE = 'https://api.moonshot.cn/v1';
const KIMI_API_URL = `${KIMI_API_BASE}/chat/completions`;

const KIMI_API_KEY = 'sk-APfzbsyYDBFjowsTFDmhayncH7VIkGnFfFDrksGGOKxtNguC';

export async function generateKimiReply(letter) {
  if (!KIMI_API_KEY) {
    throw new Error('未配置 KIMI_API_KEY');
  }

  const systemPrompt = `你是一位温柔、治愈、富有同理心的"小铺掌柜"。
你的任务是给一位向你投递心事的用户写一封回信。

## 用户当前的心情
${letter.mood}

## 回信要求
1. 语气：极尽温柔、平和，像一位老友在耳边低语。
2. 内容：针对用户写下的具体内容给予情感上的支持和疏导。
3. 结构：
   - 开头：简单问候。
   - 中间：共情用户的感受，提供一点点治愈的建议（不要说教）。
   - 结尾：固定后缀"—— 小铺掌柜"。
4. 字数：控制在 100-200 字左右，不要太长。
5. 严禁出现"AI"、"模型"、"程序"等字眼，保持人设。`;

  try {
    console.log('[Kimi] 准备请求 API...', { 
      model: "kimi-k2.5", 
      content: letter.content.slice(0, 20) + '...' 
    });

    const response = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIMI_API_KEY.trim()}`
      },
      body: JSON.stringify({
        model: "kimi-k2.5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: letter.content }
        ],
        temperature: 1,  // 修正：kimi-k2.5 当前只支持 temperature=1
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[Kimi] API 返回错误:', error);
      throw new Error(error.error?.message || `请求失败: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Kimi] 回信生成成功');
    
    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error('[Kimi] 请求异常:', err);
    throw err;
  }
}