import { sql } from '../../../db.js';

export function Statistics(server, opt) {
    server.get('/statistics', async (request, reply) => {

        const post_id = request.query.post_id;
        const user_id = request.user.id;

        try {
            if (post_id) {
                await sql`SELECT  `

            } else {

            }
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ message: 'Erro ao registrar like', error: error.message });
        }           
    });
}