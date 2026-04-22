const express = require("express");
const { Tcc } = require("../database/models");

const router = express.Router();

router.post("/recomendar", async (req, res) => {
  const { ideia } = req.body;

  if (!ideia || ideia.trim().length < 5) {
    return res.status(400).json({ error: "Descreva melhor sua ideia." });
  }

  try {
    const tccs = await Tcc.find().select("titulo autor curso ano resumo tipo");

    if (tccs.length === 0) {
      return res.json({ texto: "Ainda não há TCCs cadastrados no acervo.", recomendados: [] });
    }

    const listaFormatada = tccs.map((t, i) =>
      `[${i + 1}] Título: ${t.titulo} | Autor: ${t.autor} | Curso: ${t.curso} | Ano: ${t.ano} | Resumo: ${t.resumo || "Sem resumo"}`
    ).join("\n");

    const prompt = `Você é um assistente especializado em trabalhos acadêmicos do CEEP (Centro Estadual de Educação Profissional).
Um aluno descreveu a ideia do TCC que quer fazer:

"${ideia}"

Abaixo estão os TCCs disponíveis no acervo:

${listaFormatada}

Com base na ideia do aluno, recomende os 3 TCCs mais relevantes para servir de inspiração.
Para cada um, explique em 1-2 frases por que ele é relevante para a ideia do aluno.
Responda em português, de forma amigável e motivadora.
Formato: para cada TCC recomendado, informe o número entre colchetes [N], o título e a justificativa.`;

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
      console.error("Erro Gemini:", data);
      return res.status(500).json({ error: "Erro ao consultar a IA." });
    }

    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível gerar recomendações.";

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
    res.status(500).json({ error: "Erro interno ao processar recomendação." });
  }
});

module.exports = router;