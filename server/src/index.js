import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import testRoutes from './routes/test.js';
import budgetRoutes from './routes/budget.js';

dotenv.config();
const app = express();
const port = Number(process.env.PORT) || 3001;
app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (_request, response) => response.json({ ok: true, service: 'educa-finance-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/budget', budgetRoutes);
app.use((error, _request, response, _next) => { console.error(error.message); return response.status(500).json({ error: 'Não foi possível concluir a operação.' }); });
app.listen(port, () => console.log(`API educa-finance escutando na porta ${port}`));
export default app;
