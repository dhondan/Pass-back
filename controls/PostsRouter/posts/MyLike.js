import { sql } from "../../../db.js";

export function MyLike(server, opts) {

   server.get('/post/getmylike/:id', async (request, reply) => {
    const post_id = request.params.id

    const user_id = request.user.id;

    console.log(post_id)

   try {
      // Conta quantos likes existem para esse post
      const result = await sql`
        SELECT EXISTS (
          SELECT 1
          FROM like_posts
          WHERE post_id = ${post_id} AND user_id = ${user_id}
        ) AS liked
      `;
        console.log(result)
      return reply.status(200).send({
        liked: result[0]
      });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: 'Erro ao buscar likes', error: error.message });
    }
});
}