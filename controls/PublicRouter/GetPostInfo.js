import { sql } from "../../db.js";

export async function GetPostInfo(server, opts) {
    server.get('/public/getpostinfo', async (request, reply) => {

            console.log(server)
        try {
            const postId = request.query.id;

            if (!postId) {
                return reply.status(400).send({ error: "ID do post é obrigatório" });
            }


            const post = await sql`
    SELECT 
        p.id, 
        p.title, 
        p.first_paragraph, 
        p.second_paragraph, 
        p.third_paragraph,
        p.fourth_paragraph, 
        p.fifth_paragraph, 
        p.sixth_paragraph,
        p.image, 
        p.type, 
        p.genre, 
        u.id as user_id, 
        u.name as user_name,
        u.image_profile as user_avatar,
        p.created_at, 
        p.updated_at
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ${postId}
    ORDER BY p.created_at DESC
    LIMIT 20
`;

            if (!post) {
                return reply.status(404).send({ error: "Post não encontrado" });
            }

            return reply.status(200).send({ post });

        } catch (error) {
            console.error(error);
            return reply.status(500).send({ error: "Erro ao buscar post", details: error.message });
        }
    });
}
