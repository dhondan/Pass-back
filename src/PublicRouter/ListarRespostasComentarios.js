import admin from 'firebase-admin';
const firebaseDB = admin.firestore();

export async function ListarRespostas(server, opts) {
  server.get('/public/comentarios/:postId/:commentId/replies', async (request, reply) => {
    try {
      const { postId, commentId } = request.params;

      if (!postId || !commentId) {
        return reply.status(400).send({ error: "IDs obrigatórios" });
      }

      const commentRef = firebaseDB
        .collection('Posts')
        .doc(postId)
        .collection('Comments')
        .doc(commentId);

      const commentSnap = await commentRef.get();
      if (!commentSnap.exists) {
        return reply.status(404).send({ error: "Comentário não encontrado" });
      }

      const repliesRef = commentRef.collection('Replies');
      const repliesSnap = await repliesRef.get();
      if (repliesSnap.empty) return reply.send({ replies: [] });

      const replies = repliesSnap.docs.map(r => ({
        id: r.id,
        ...r.data()
      }));

      return reply.send({ replies });

    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Erro interno do servidor" });
    }
  });
}
