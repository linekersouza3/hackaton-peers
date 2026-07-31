const express = require('express');
const app = express();
app.use(express.json());

// Dados simulados de esteiras de um centro de distribuição
const esteiras = [
  { id: 1, setor: 'Recebimento', velocidade: 1.2, status: 'operando' },
  { id: 2, setor: 'Separação', velocidade: 0.8, status: 'operando' },
  { id: 3, setor: 'Expedição', velocidade: 1.5, status: 'manutenção' },
];

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/esteiras', (req, res) => {
  res.status(200).json(esteiras);
});

app.get('/esteiras/:id', (req, res) => {
  const esteira = esteiras.find((e) => e.id === Number(req.params.id));
  if (!esteira) {
    return res.status(404).json({ error: 'Esteira não encontrada' });
  }
  res.status(200).json(esteira);
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`LogiTrack API rodando na porta ${PORT}`));
}

module.exports = app;
