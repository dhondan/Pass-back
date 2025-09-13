import { randomUUID } from "node:crypto"
import { sql } from "../../db.js";
import fastifyJwt from "@fastify/jwt";
import bcrypt from 'bcrypt'

export async function EditUser(server, opts) {

    server.post('/edituser', async (request, reply) => {
        const {
            name,
            email,
            newdata,
        } = request.body;

        const id = request.user.id

        try {
            await sql`
        UPDATE users
        SET
          name = ${name},
          email = ${email}
        WHERE id = ${id}
      `;

             reply.status(201).send({mensage: "user editado com sucesso"})

        } catch (err) {
            console.log(err)
        }

        return reply.status(201).send({ message: "Usuário criado com sucesso!", id });
    })
}
