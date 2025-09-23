import { sql } from "../../db.js";

export async function getLikePost(server, opts) {

   server.get('/public/getlike/:id', async (request, reply) => {
    const post_id = request.params.id

    console.log(post_id)

   try {
      // Conta quantos likes existem para esse post
      const result = await sql`
        SELECT COUNT(*) as likes_count
        FROM like_posts
        WHERE post_id = ${post_id}
      `;
        console.log(result)
      // result[0].likes_count vai ter a quantidade
      return reply.status(200).send({ likes: Number(result[0].likes_count) });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: 'Erro ao buscar likes', error: error.message });
    }
});
}