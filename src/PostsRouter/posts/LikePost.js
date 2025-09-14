import { sql } from '../../../db.js';

export function LikePost(server, opt) {
    server.get('/post/like/:id', async (request, reply) => {


        const post_id = request.params.id;
        const user_id = request.user.id;

        try {

            const existing = await sql`
  SELECT 1 FROM post_likes
  WHERE user_id = ${user_id} AND post_id = ${post_id}
`;

            if (existing.length > 0) {
                // Já existe → deslike
                await sql`
    DELETE FROM post_likes
    WHERE user_id = ${user_id} AND post_id = ${post_id}
  `;
                return reply.status(200).send({ message: "Like removido" });
            } else {
                // Não existe → adiciona like
                await sql`
    INSERT INTO post_likes (user_id, post_id)
    VALUES (${user_id}, ${post_id})
  `;
                return reply.status(201).send({ message: "Like adicionado" });
            }
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ message: 'Erro ao registrar like', error: error.message });
        }
    });
}