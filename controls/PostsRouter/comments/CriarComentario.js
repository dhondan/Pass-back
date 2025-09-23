import { randomUUID } from "node:crypto";
import admin from 'firebase-admin';
import { app as firebaseApp } from '../../util/firebase.js';
const firebaseDB = admin.firestore();

export async function CriarComentario(server, opts) {
    server.post('/createComent/:postId', async (request, reply) => {
        const postId = request.params.postId;
        const userId = request.user.id; // Usuário autenticado
        const { comment, parentCommentId } = request.body;
        console.log(userId)

        // Validações iniciais
        if (!postId || typeof postId !== 'string') {
            return reply.status(400).send({ error: "Post inválido" });
        }

        if (!comment || typeof comment !== 'string' || comment.trim().length < 2) {
            return reply.status(400).send({ error: "Comentário precisa ter pelo menos 2 caracteres." });
        }

        try {
            const postRef = firebaseDB.collection('Posts').doc(postId);
            const postSnap = await postRef.get();

            if (!postSnap.exists) {
                return reply.status(404).send({ error: "Post não encontrado" });
            }

            let commentRef;

            if (parentCommentId) {
                if (typeof parentCommentId !== 'string') {
                    return reply.status(400).send({ error: "ID do comentário pai inválido" });
                }

                // Verifica se o comentário pai existe
                const parentRef = firebaseDB
                    .collection('Posts')
                    .doc(postId)
                    .collection('Comments')
                    .doc(parentCommentId);
                const parentSnap = await parentRef.get();
                console.log(parentCommentId)

                if (!parentSnap.exists) {
                    return reply.status(404).send({ error: "Comentário pai não encontrado" });
                }

                // Cria referência do comentário filho
                commentRef = parentRef.collection('Replies').doc(randomUUID());
            } else {
                // Comentário principal
                commentRef = firebaseDB
                    .collection('Posts')
                    .doc(postId)
                    .collection('Comments')
                    .doc(randomUUID());
            }

            await commentRef.set({
                UserId: userId,
                Comment: comment.trim(),
                ParentCommentId: parentCommentId || null,
                CreatedAt: new Date().toISOString(),
            });

            return reply.status(201).send({ message: "Comentário criado com sucesso" });
        } catch (error) {
            console.error("Erro ao criar comentário:", error);
            return reply.status(500).send({ error: "Erro interno ao criar comentário" });
        }
    });
}
