import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(origin => origin);

console.log("🔒 Origens permitidas:", allowedOrigins);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.error(`❌ Bloqueio CORS. Origem negada: ${origin}`);
            callback(new Error('Bloqueado pelo CORS'));
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use('/api', routes);

app.use((err, req, res, next) => {
    if (err.message === 'Bloqueado pelo CORS') {
        return res.status(403).json({
            error: 'CORS Error',
            message: 'Esta origem não tem permissão para acessar a API.'
        });
    }

    console.error(err.stack);
    res.status(500).json({ error: 'Ocorreu um erro interno no servidor' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌐 API disponível`);
});

export default app;