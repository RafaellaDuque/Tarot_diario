// api/ler-cartas.js

export default async function handler(req, res) {
    // 1. Bloqueia se não for um método POST (segurança)
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }
  
    const { pergunta, cartas } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY; 
  
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Você é um tarólogo profissional. O usuário perguntou: "${pergunta}". As cartas sorteadas foram: ${cartas.join(", ")}. Faça uma leitura mística e encorajadora em português.` }]
          }]
        })
      });
  
      const data = await response.json();
      const textoDaIA = data.candidates[0].content.parts[0].text;
  
      // Retorna a resposta para o seu site
      res.status(200).json({ leitura: textoDaIA });
      
    } catch (error) {
      res.status(500).json({ error: 'Falha na conexão com a IA' });
    }
  }