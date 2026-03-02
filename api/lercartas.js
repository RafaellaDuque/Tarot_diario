// api/ler-cartas.js

export default async function handler(req, res) {
    // 1. Bloqueia se não for um método POST (segurança)
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }
  
    const { pergunta, cartas } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY não configurada. Crie o arquivo .env.local com sua chave." });
    }
    if (!pergunta || !cartas || !Array.isArray(cartas)) {
      return res.status(400).json({ error: "Envie pergunta e cartas (array) no body" });
    }
    const cartasValidas = cartas.every(c => c && typeof c.nome === 'string' && typeof c.descricao === 'string');
    if (!cartasValidas) {
      return res.status(400).json({ error: "Cada carta deve ter nome e descricao" });
    }

    const cartasTexto = cartas.map(c => `- ${c.nome}: ${c.descricao}`).join("\n");
    const numCartas = cartas.length;
    const limiteTexto = numCartas === 1 ? "180 a 250 palavras" : "300 a 400 palavras";

    const systemInstruction = `Você é uma taróloga experiente e acolhedora. Sua leitura deve soar como uma conversa íntima e natural, não como um texto acadêmico. Regras:
- Escreva em português brasileiro, tom caloroso e encorajador
- Texto corrido em 3 a 4 parágrafos (sem títulos, sem listas, sem bullet points)
- Máximo de ${limiteTexto}
- Conecte o significado das cartas diretamente à pergunta do usuário
- Não repita a descrição da carta literalmente; use-a como base para sua interpretação pessoal
- Comece direto na interpretação, sem frases introdutórias como "Ah, que carta linda!" ou "Que carta interessante!" ou "Nossa que energia maravilhosa!"
- Termine com uma reflexão ou conselho prático e positivo
- Não use emojis`;

    const userMessage = `Pergunta: "${pergunta}"

${numCartas === 1 ? "Carta sorteada" : "Cartas sorteadas"}:
${cartasTexto}

Faça a leitura.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: [{
            parts: [{ text: userMessage }]
          }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 600
          }
        })
      });
  
      const data = await response.json();

      if (!response.ok) {
        const msg = data.error?.message || data.error || "Erro na API do Gemini";
        return res.status(502).json({ error: msg });
      }

      const textoDaIA = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textoDaIA) {
        return res.status(502).json({ error: "Resposta inválida da IA" });
      }

      res.status(200).json({ leitura: textoDaIA });
      
    } catch (error) {
      res.status(500).json({ error: 'Falha na conexão com a IA' });
    }
  }