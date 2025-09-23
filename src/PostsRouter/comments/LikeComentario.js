import { randomUUID } from "node:crypto"
import { sql } from "../../../db.js"
import admin from 'firebase-admin';
import { app as firebaseApp } from '../../util/firebase.js';

const firebaseDB = admin.firestore();

export async function LikeComentario(server, opts) {
    server.post('/likeComment', async (request, reply) => {
        const post_id = request.body.post_id;
        const comment_id = request.body.comment_id;
        const reply_id = request.body.reply_id; // se vier, é reply
        const user_id = request.user.id;

        console.log("a")

        if (!post_id || !comment_id) {
            return reply.status(400).send({ error: "post_id e comment_id são obrigatórios" });
        }

        try {
            let targetRef;
            let likeRef;

            if (reply_id) {
                // 🔹 Caso seja uma reply
                targetRef = firebaseDB
                    .collection("Posts")
                    .doc(post_id)
                    .collection("Comments")
                    .doc(comment_id)
                    .collection("Replies")
                    .doc(reply_id);

                likeRef = firebaseDB
                    .collection("Like_Reply")
                    .doc(reply_id)
                    .collection("User")
                    .doc(user_id);
            } else {
                // 🔹 Caso seja um comentário principal
                targetRef = firebaseDB
                    .collection("Posts")
                    .doc(post_id)
                    .collection("Comments")
                    .doc(comment_id);

                likeRef = firebaseDB
                    .collection("Like_Comment")
                    .doc(comment_id)
                    .collection("User")
                    .doc(user_id);
            }

            // 🔹 Verifica se existe o comentário/reply antes de dar like
            const targetSnap = await targetRef.get();
            if (!targetSnap.exists) {
                return reply.status(404).send({ error: "Comentário ou reply não encontrado" });
            }

            // 🔹 Verifica se o usuário já deu like
            const likeSnap = await likeRef.get();
            if (likeSnap.exists) {
                await likeRef.delete();
                return reply.status(204).send({ message: "Like removido" });
            }

            // 🔹 Cria o like
            await likeRef.set({
                UserId: user_id,
                CreatedAt: new Date().toISOString(),
            });

            return reply.status(201).send({ message: "Like adicionado com sucesso" });

        } catch (err) {
            console.error(err);
            return reply.status(500).send({ error: "Erro ao processar like" });
        }
    });
}
