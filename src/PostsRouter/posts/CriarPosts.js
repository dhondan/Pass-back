import { randomUUID } from "node:crypto"
import { sql } from "../../../db.js"
import admin from 'firebase-admin'; // Importe o admin novamente para referência
import { app as firebaseApp } from '../../util/firebase.js'; // Importe o app do arquivo firebase.js
const firebaseDB = admin.firestore();

export async function CriarPosts(server, opts) {
  server.post('/post/create', async (request, reply) => {
    const user_id = request.user.id;

    try {
      const {
        title,
        first_paragraph,
        second_paragraph,
        third_paragraph,
        fourth_paragraph,
        fifth_paragraph,
        sixth_paragraph,
        image,
        type,
        genre,
      } = request.body


      const normalizeParagraph = (p, index) => {
        if (!p || p.trim() === "") return null   // vazio -> null
        if (p.length < 50) {
          throw new Error(`O parágrafo ${index + 1} precisa ter pelo menos 50 caracteres.`)
        }
        return p
      }

      // Normaliza todos de uma vez
      const paragraphs = [
        first_paragraph,
        second_paragraph,
        third_paragraph,
        fourth_paragraph,
        fifth_paragraph,
        sixth_paragraph,
      ].map(normalizeParagraph)

      const post_id = randomUUID()

      // Checa condição de criação
      const podeCriar = paragraphs.every(p => p === null || p.length < 256)

      if (!podeCriar) {
        return reply.status(400).send({ error: "Um ou mais parágrafos são inválidos." })
      }

      console.log({
        title, image, type, genre,
        paragraphs,
        user_id
      })

      await sql`
        INSERT INTO posts (
          id, title,
          first_paragraph, second_paragraph, third_paragraph,
          fourth_paragraph, fifth_paragraph, sixth_paragraph,
          image, type, genre, user_id
        )
        VALUES (
          ${post_id}, ${title},
          ${paragraphs[0]}, ${paragraphs[1]}, ${paragraphs[2]},
          ${paragraphs[3]}, ${paragraphs[4]}, ${paragraphs[5]},
          ${image}, ${type}, ${genre}, ${user_id}
        )
      `

      firebaseDB.collection('Posts').doc(post_id).set(
        { createdAt: new Date().toISOString() }
      )
        .then(() => {
          console.log('Post criado no Firestore com sucesso!');
        })
        .catch((error) => {
          console.error('Erro ao criar post no Firestore: ', error);
        });

      return reply.status(201).send({ message: "Post criado com sucesso" })


    } catch (err) {
      console.error(err)
      return reply.status(400).send({ error: err.message })
    }
  })
}
