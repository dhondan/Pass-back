import admin from 'firebase-admin';
import { app as firebaseApp } from '../util/firebase.js'; 
const firebaseDB = admin.firestore();

export async function ListarComentarios(server, opts) {
  server.get('/public/comentarios/:postId', async (request, reply) => {
    try {
      const postId = request.params.postId;
      if (!postId) {
        return reply.status(400).send({ error: "ID do post é obrigatório" });
      }

      const postRef = firebaseDB.collection('Posts').doc(postId);
      const postSnap = await postRef.get();

      if (!postSnap.exists) {
        return reply.status(404).send({ error: "Post não encontrado" });
      }

      // 🔹 Buscar comentários ordenados pela data
      const commentsRef = postRef
        .collection('Comments')
        .orderBy('CreatedAt', 'desc'); // mais novos primeiro

      const commentsSnap = await commentsRef.get();

      if (commentsSnap.empty) {
        return reply.status(201).send({ Menssage: "Nenhum comentário encontrado para este post" });
      }

      // Mapear comentários com possíveis respostas
      const comments = await Promise.all(
        commentsSnap.docs.map(async (doc) => {
          const data = doc.data();

          // 🔹 Buscar respostas ordenadas também
          const repliesRef = doc.ref
            .collection('Replies')
            .orderBy('CreatedAt', 'asc'); // mais antigas primeiro nas respostas

          const repliesSnap = await repliesRef.get();

          const replies = repliesSnap.empty
            ? []
            : repliesSnap.docs.map(r => ({ id: r.id, ...r.data() }));

          return {
            id: doc.id,
            ...data,
            replies,
          };
        })
      );

      return reply.send({ comments });

    } catch (err) {
      console.error("Erro ao buscar comentário:", err);
      return reply.status(500).send({ error: "Não tem comentarios" });
    }
  });
}
