import { randomUUID } from "node:crypto"
import { sql } from "../../db.js";
import fastifyJwt from "@fastify/jwt";
import bcrypt from 'bcrypt'
import dotenv from "dotenv";

dotenv.config();

export async function TokenValidation(server, opts) {

    server.post('/validation', async (request, reply) => {

        try {

            const decode = server.jwt.decode(request.body.token)
           
            const userId = decode.id

            const infos = await sql`SELECT * FROM users WHERE id = ${userId}`

            const {id, name, email, image_profile, bio} = infos[0]

            return reply.status(401).send({ id, name, email, image_profile, bio});
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ message: "Erro no servidor" });
        }
    });
}
