import { sql } from "../../db.js";

export async function DeletarPost(server, opts) {
    server.delete('/delete/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            console.log(id)

            const [post] = await sql`
                SELECT user_id 
                FROM posts 
                WHERE id = ${id}
            `;

            if (!post) {
                return reply.status(404).send({ message: 'Post não encontrado' });
            }


            if (post.user_id !== request.user.id) {
                return reply.status(403).send({ message: 'Você não tem permissão para deletar este post' });
            }

            await sql`
                DELETE FROM posts
                WHERE id = ${id}
            `;

            return reply.status(200).send({ message: 'Post deletado com sucesso' });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ message: 'Erro ao deletar post', error: error.message });
        }
    });
}
