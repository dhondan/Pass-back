import { randomUUID } from "node:crypto"
import { sql } from "../../db.js";
import fastifyJwt from "@fastify/jwt";
import bcrypt from 'bcrypt'
import dotenv from "dotenv";

dotenv.config();

export async function TokenValidation(server, opts) {

    server.get('/validation', async (request, reply) => {
        try {
            return reply.status(200).send({ message: "user logado" });
        } catch (err) {
            console.error(err);
            return reply.status(500).send({ message: "Erro no servidor" });
        }
    });
}
