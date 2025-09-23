import { randomUUID } from "node:crypto";
import { sql } from "../../db.js";
import bcrypt from 'bcrypt';

export async function CriarUser(server, opts) {
    server.post('/createUser', async (request, reply) => {
        const { name, email, password, passwordConfirmation } = request.body;

        // Validações
        if (!name || name.trim().length < 3) {
            return reply.status(400).send({ error: "O nome deve ter pelo menos 3 caracteres." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return reply.status(400).send({ error: "Email inválido." });
        }

        if (!password || !passwordConfirmation) {
            return reply.status(400).send({ error: "Senha e confirmação são obrigatórias." });
        }

        if (password !== passwordConfirmation) {
            return reply.status(400).send({ error: "As senhas não coincidem." });
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return reply.status(400).send({ error: "A senha deve ter pelo menos 8 caracteres, incluindo uma letra e um número." });
        }

        const newPassword = bcrypt.hashSync(password, 10);
        const id = randomUUID();

        try {
            await sql`
                INSERT INTO users (id, name, email, password)
                VALUES (${id}, ${name}, ${email}, ${newPassword})
            `;

            const token = server.jwt.sign({ id }, { expiresIn: "1h" });

            return reply
                .setCookie('token', token, {
                    httpOnly: true, // não acessível via JS
                    secure: process.env.NODE_ENV === 'production', // só HTTPS em produção
                    sameSite: 'lax', // permite requisições do mesmo site e links externos
                    maxAge: 60 * 60 * 24 * 7, // 7 dias
                    path: '/',
                })
                .status(201)
                .send({
                    message: "Usuário criado com sucesso!",
                    user: { id, name, email },
                });
                
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "Erro ao criar usuário." });
        }
    });
}
