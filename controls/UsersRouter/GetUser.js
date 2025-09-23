import { sql } from "../../db.js";

export async function GetUser(server, opts) {

   server.get('/getuser', async (request, reply) => {
    const id = request.user.id

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