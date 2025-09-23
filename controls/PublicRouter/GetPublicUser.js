import { sql } from "../../db.js";

export async function GetPublicUser(server, opts) {

   server.get('/public/getpublicuser/:id', async (request, reply) => {
    const id = request.params.id

    console.log(id)

    try {
    const user = await sql`
        SELECT name, image_profile
        FROM users WHERE id = ${id}
        LIMIT 20
    `;
    return reply.send({ user });
        
    } catch(err) {
        return reply.send({ err });
    }

});
}