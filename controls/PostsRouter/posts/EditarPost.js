import { sql } from "../../../db.js";

export async function EditarPost(server, opts) {
    server.put('/post/edit/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            console.log(id)

            const {
                title,
                first_paragraph,
                second_paragraph,
                third_paragraph,
                fourth_paragraph,
                fifth_paragraph,
                sixth_paragraph,
                image,
                type,
                genre
            } = request.body;

            const [post] = await sql`
                SELECT user_id
                FROM posts
                WHERE id = ${id}
            `;

            if (!post) {
                return reply.status(404).send({ message: 'Post não encontrado' });
            }

            if (post.user_id !== request.user.id) {
                return reply.status(403).send({ message: 'Você não tem permissão para editar este post' });
            }

            await sql`
                UPDATE posts
                SET 
                    title = ${title},
                    first_paragraph = ${first_paragraph},
                    second_paragraph = ${second_paragraph},
                    third_paragraph = ${third_paragraph},
                    fourth_paragraph = ${fourth_paragraph},
                    fifth_paragraph = ${fifth_paragraph},
                    sixth_paragraph = ${sixth_paragraph},
                    image = ${image},
                    type = ${type},
                    genre = ${genre}
                WHERE id = ${id}
            `;

            return reply.status(200).send({ message: 'Post atualizado com sucesso' });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ message: 'Erro ao atualizar post', error: error.message });
        }
    });
}
