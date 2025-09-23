import { sql } from "../../db.js";

export async function EditUser(server, opts) {
    server.post('/edituser', async (request, reply) => {
        const { name, email } = request.body;
        const id = request.user?.id;

        if (!id) {
            return reply.status(401).send({ error: "Usuário não autenticado." });
        }

        // Validações
        if (!name || name.trim().length < 3) {
            return reply.status(400).send({ error: "O nome deve ter pelo menos 3 caracteres." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return reply.status(400).send({ error: "Email inválido." });
        }

        try {
            await sql`
                UPDATE users
                SET name = ${name}, email = ${email}
                WHERE id = ${id}
            `;

            return reply.status(200).send({ message: "Usuário editado com sucesso!", user: { id, name, email } });

        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "Erro ao editar usuário." });
        }
    });
}
