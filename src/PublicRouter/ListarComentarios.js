import admin from 'firebase-admin'; // Importe o admin novamente para referência
import { app as firebaseApp } from '../util/firebase.js'; // Importe o app do arquivo firebase.js
const firebaseDB = admin.firestore();

export async function ListarComentarios(server, opts) {
  server.get('/public/comentarios', async (request, reply) => {
    try {
      const postId = request.query.id;
      if (!postId) {
        return reply.status(400).send({ error: "ID do post é obrigatório" });
      }

      const postRef = firebaseDB.collection('Posts').doc(postId);
      const postSnap = await postRef.get();

      if (!postSnap.exists) {
        return reply.status(404).send({ error: "Post não encontrado" });
      }

      const commentsRef = postRef.collection('Comments');
      const commentsSnap = await commentsRef.get();

      if (commentsSnap.empty) {
        return reply.status(404).send({ error: "Nenhum comentário encontrado para este post" });
      }

      return reply.send({ commentsSnap: commentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) });

    } catch (err) {
      console.error("Erro ao buscar comentário:", err);
      return reply.status(500).send({ error: "Erro interno do servidor" });
    }
  });
}