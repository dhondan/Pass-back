import { randomUUID } from "node:crypto"
import { sql } from "../../../db.js"
import admin from 'firebase-admin'; // Importe o admin novamente para referência
import { app as firebaseApp } from '../../util/firebase.js'; // Importe o app do arquivo firebase.js
const firebaseDB = admin.firestore();

export async function LikeComentario(server, opts) {
    server.post('/likeComment', async (request, reply) => {

        const post_id = request.body.post_id
        const comment_id = request.body.comment_id
        const user_id = request.user.id;

        const postRef = firebaseDB.collection('Posts').doc(post_id).collection('Comments').doc(comment_id);
        const likeRef = firebaseDB.collection('Like_Comment').doc(comment_id).collection('User').doc(user_id);
        const postSnap = await postRef.get();
        const likeSnap = await likeRef.get();

        if (!postSnap.exists) {
            return reply.status(404).send({ error: "Post ou cometário não encontrado" })
        }
        console.log(likeSnap.exists)
        if (likeSnap.exists){
            await likeRef.delete()
            return reply.status(204).send({ menssage: "Like tirado" })
        }

        try {

            async function Like() {
                 await likeRef.set(
                    {
                        UserId: user_id,
                        CreatedAt: new Date().toISOString(),
                    }
                );
            }

            try {
                await Like();
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
