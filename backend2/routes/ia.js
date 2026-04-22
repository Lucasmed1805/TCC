const express = require("express");
const { Tcc } = require("../database/models");

const router = express.Router();

router.post("/recomendar", async (req, res) => {
  const { ideia } = req.body;

  if (!ideia || ideia.trim().length < 5) {
    return res.status(400).json({ error: "Digite uma pergunta ou ideia." });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY não configurada!");
    return res.status(500).json({ error: "Chave da IA não configurada no servidor." });
  }

  try {
    const tccs = await Tcc.find().select("titulo autor curso ano resumo tipo");

    const listaFormatada = tccs.length > 0
      ? tccs.map((t, i) =>
          `[${i + 1}] Título: ${t.titulo} | Autor: ${t.autor} | Curso: ${t.curso} | Ano: ${t.ano} | Resumo: ${t.resumo || "Sem resumo"}`
        ).join("\n")
      : "Nenhum TCC cadastrado ainda.";

    const prompt = `Você é um assistente virtual inteligente do TCC Digital, plataforma de trabalhos acadêmicos do CEEP (Centro Estadual de Educação Profissional).

Você pode responder qualquer tipo de pergunta: dúvidas gerais, curiosidades, perguntas sobre o site, sobre TCCs, sobre cursos, temas acadêmicos, tecnologia, ou qualquer outro assunto.

Quando a pergunta for relacionada a TCCs ou ao acervo do site, use os dados abaixo como referência:

--- ACERVO DO SITE ---
${listaFormatada}
--- FIM DO ACERVO ---

Informações sobre o site:
- Nome: TCC Digital CEEP
- Funcionalidades: buscar TCCs por título ou autor, filtrar por categoria/curso/ano, visualizar detalhes de cada TCC, assistente de inspiração com IA.
- Público: alunos e professores do CEEP.

Pergunta/mensagem do usuário:
"${ideia}"

Responda em português, de forma clara, amigável e útil. Se for uma recomendação de TCC, informe o número entre colchetes [N] de cada recomendado. Se for uma pergunta geral, apenas responda diretamente sem mencionar o acervo.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro Gemini status:", response.status);
      console.error("Erro Gemini body:", JSON.stringify(data));

      // Mensagens de erro mais específicas
      if (response.status === 400) return res.status(500).json({ error: "Requisição inválida para a IA." });
      if (response.status === 403) return res.status(500).json({ error: "Chave da IA inválida ou sem permissão." });
      if (response.status === 429) return res.status(500).json({ error: "Limite de uso da IA atingido. Tente novamente em instantes." });

      return res.status(500).json({ error: "Erro ao consultar a IA." });
    }

    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível gerar uma resposta.";

    const indices = [...texto.matchAll(/\[(\d+)\]/g)].map(m => parseInt(m[1]) - 1);
    const recomendados = indices
      .filter(i => i >= 0 && i < tccs.length)
      .map(i => ({
        _id: tccs[i]._id,
        titulo: tccs[i].titulo,
        autor: tccs[i].autor,
        curso: tccs[i].curso,
        ano: tccs[i].ano,
      }));

    res.json({ texto, recomendados });

  } catch (err) {
    console.error("Erro na rota IA:", err);
    res.status(500).json({ error: "Erro interno ao processar sua pergunta." });
  }
});

module.exports = router;