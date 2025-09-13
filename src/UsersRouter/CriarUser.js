import { randomUUID } from "node:crypto"
import { sql } from "../../db.js";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import bcrypt from 'bcrypt'

export async function CriarUser(server, opts) {

    server.post('/createUser', async (request, reply) => {
        const {
            name,
            email,
            password,
            passwordConfirmation
        } = request.body;


        if (password !== passwordConfirmation && name == null || undefined && email == null || undefined) {
            return reply.status(400).send({ error: "As senhas não coincidem." });
        }

        const newpassword = bcrypt.hashSync(password, 10);
        const id = randomUUID();

        try {

            await sql`
            INSERT INTO users (id, name, email, password)
            VALUES (${id}, ${name}, ${email}, ${newpassword})
        `;

            const token = server.jwt.sign(
                { id },   
                { expiresIn: "1h" } 
            );

             reply
                .setCookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // só HTTPS em produção
                    sameSite: 'strict',
                    maxAge: 60 * 60, // 1 hora em segundos
                    path: '/',       // disponível em todo o domínio
                })
                .status(201)
                .send({
                    message: "Usuário criado com sucesso!",
                    user: { id, name, email } // não retorna token
                });

            return reply.status(201).send({
                message: "Usuário criado com sucesso!",
                user: { id },
                token
            });

        } catch (err) {
            console.log(err)
        }

        return reply.status(201).send({ message: "Usuário criado com sucesso!", id });
    })
}
