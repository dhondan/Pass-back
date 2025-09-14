import { randomUUID } from "node:crypto"
import { sql } from "../../../db.js"
import admin from 'firebase-admin'; // Importe o admin novamente para referência
import { app as firebaseApp } from '../../util/firebase.js'; // Importe o app do arquivo firebase.js
const firebaseDB = admin.firestore();

export async function CriarComentario(server, opts) {
    server.post('/createComent/:id', async (request, reply) => {

        const post_id = request.params.id
        const user_id = request.user.id;

        const postRef = firebaseDB.collection('Posts').doc(post_id);
        const postSnap = await postRef.get();

        if (!postSnap.exists) {
            return reply.status(404).send({ error: "Post não encontrado" })
        }

        try {
            const {
                comment
            } = request.body


            const normalizeParagraph = (p, index) => {
                if (!p || p.trim() === "") return null   // vazio -> null
                if (p.length < 2) {
                    throw new Error(`O parágrafo ${index + 1} precisa ter pelo menos 50 caracteres.`)
                }
                return p
            }

            // Normaliza todos de uma vez
            const comments = [
                comment,
            ].map(normalizeParagraph)

            const commentId = randomUUID()

            // Checa condição de criação
            const podeCriar = comments.every(p => p === null || p.length < 256)

            if (!podeCriar) {
                return reply.status(400).send({ error: "Comentário invalido" })
            }

            async function CriarComentarioFirestore(userId) {
                await firebaseDB.collection('Posts').doc(post_id).collection('Comments').doc(commentId).set(
                    {
                        UserId: user_id,
                        Comment: comments[0],
                        CreatedAt: new Date().toISOString(),
                    }
                );
            }

            try {
                await CriarComentarioFirestore(user_id);
                console.log('Documento adicionado com sucesso!');
            } catch (error) {
                console.error('Erro ao adicionar documento:', error);
                return reply.status(500).send({ error: "Erro ao criar comentário" });
            }

            return reply.status(201).send({ message: "Comentario criado com sucesso" })

        } catch (err) {
            console.error(err)
            return reply.status(400).send({ error: err.message })
        }
    })
}
