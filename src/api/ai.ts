import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getAIExplain(data: any) {
  const prompt = `
너는 사용자에게 상황을 설명하는 AI야.

데이터:
${JSON.stringify(data)}

역할:
- 왜 가능한지 / 불가능한지 설명
- 해결 방법 제안
- 매장 방문 순서 추천

JSON으로만 답해:

{
  "message": "",
  "summary": "",
  "recommendRemove": [],
  "route": []
}
`;

  const res = await client.responses.create({
    model: "gpt-5.4-mini",
    input: prompt,
  });

  return JSON.parse(res.output_text);
}
