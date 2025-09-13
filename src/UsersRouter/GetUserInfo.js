import { sql } from "../../db.js";

export async function GetUserInfo(server, opts) {
    server.get('/getuserinfo', async (request, reply) => {
        try {
            const userId = request.user.id; // vem do token JWT

            // Busca o usuário no banco, sem retornar senha
            const [user] = await sql`
                SELECT id, name, email, image_profile, age, bio, created_at, updated_at
                FROM users
                WHERE id = ${userId}
            `;

            if (!user) {
                return reply.status(404).send({ error: "Usuário não encontrado" });
            }

            return reply.status(200).send({ user });

        } catch (error) {
            return reply.status(500).send({ error: "Erro ao buscar usuário", details: error.message });
        }
    });
}
