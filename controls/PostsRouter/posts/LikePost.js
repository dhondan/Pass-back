import { sql } from '../../../db.js';
import { randomUUID } from 'crypto';

export function LikePost(server, opt) {
  server.get('/post/like/:id', async (request, reply) => {

    const post_id = request.params.id;
    const user_id = request.user.id;
    const like_id = randomUUID(); // cria um ID único para o like
    const created_at = new Date(); // registra data/hora do like

    try {
      const existing = await sql`
        SELECT 1 FROM like_posts
        WHERE user_id = ${user_id} AND post_id = ${post_id}
      `;

      if (existing.length > 0) {
        // Já existe → deslike
        await sql`
          DELETE FROM like_posts
          WHERE user_id = ${user_id} AND post_id = ${post_id}
        `;
        return reply.status(200).send({ message: "Like removido" });
      } else {
        // Não existe → adiciona like
        await sql`
          INSERT INTO like_posts (user_id, post_id, creator_id, created_at)
          VALUES (${user_id}, ${post_id}, ${user_id},${created_at})
        `;
        return reply.status(201).send({ message: "Like adicionado" });
      }
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: 'Erro ao registrar like', error: error.message });
    }
  });
}
