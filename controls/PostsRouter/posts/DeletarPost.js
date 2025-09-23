import { sql } from "../../../db.js";
import admin from "firebase-admin";
import { app as firebaseApp } from "../../util/firebase.js";

const firebaseDB = admin.firestore();

export async function DeletarPost(server, opts) {
  server.delete("/post/delete/:id", async (request, reply) => {
    try {
      const user_id = request.user.id; // id do usuário logado
      const post_id = request.params.id; // id do post que vai ser deletado
        console.log(user_id)
      // Verifica se o post existe
      const [post] = await sql`
        SELECT id, user_id
        FROM posts
        WHERE id = ${post_id}
      `;

      if (!post) {
        return reply.status(404).send({ message: "Post não encontrado" });
      }

      // Verifica se o usuário é dono do post
      if (post.user_id !== user_id) {
        return reply
          .status(403)
          .send({ message: "Você não tem permissão para deletar este post" });
      }

      // Deleta likes vinculados ao post
      await sql`
        DELETE FROM like_posts
        WHERE post_id = ${post_id}
      `;

      // Deleta do Firestore (coleção "Posts")
      await firebaseDB.collection("Posts").doc(post_id).delete();

      // Deleta o post do banco
      await sql`
        DELETE FROM posts
        WHERE id = ${post_id}
      `;

      return reply.status(200).send({ message: "Post deletado com sucesso" });
    } catch (error) {
      console.error(error);
      return reply
        .status(500)
        .send({ message: "Erro ao deletar post", error: error.message });
    }
  });
}
