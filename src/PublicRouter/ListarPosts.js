import { sql } from "../../db.js";

export async function ListarPosts(server, opts) {
  server.get('/public/posts', async (request, reply) => {
    try {
      let Userid = request.query.id || null;
      let search = request.query.search?.trim() || null; // 🔹 termo de busca
      const page = parseInt(request.query.page) || 1; // default: página 1
      const limit = 9;
      const offset = (page - 1) * limit;

      if (search == undefined) {
        search = null
      }

      if (Userid == undefined) {
        Userid = null
      }

      let posts;

      // 🔹 Monta condição dinâmica
      if (Userid && search) {
        posts = await sql`
          SELECT 
            p.id, 
            p.title, 
            p.image, 
            p.type, 
            p.genre, 
            p.user_id, 
            p.created_at,
            u.name as user_name,
            u.image_profile as user_avatar
          FROM posts p
          JOIN users u ON p.user_id = u.id
          WHERE p.user_id = ${Userid}
          AND (p.title ILIKE ${'%' + search + '%'} OR p.genre ILIKE ${'%' + search + '%'})
          ORDER BY p.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;
      } else if (Userid) {
        posts = await sql`
          SELECT 
            p.id, 
            p.title, 
            p.image, 
            p.type, 
            p.genre, 
            p.user_id, 
            p.created_at,
            u.name as user_name,
            u.image_profile as user_avatar
          FROM posts p
          JOIN users u ON p.user_id = u.id
          WHERE p.user_id = ${Userid}
          ORDER BY p.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;
      } else if (search) {
        posts = await sql`
          SELECT 
            p.id, 
            p.title, 
            p.image, 
            p.type, 
            p.genre, 
            p.user_id, 
            p.created_at,
            u.name as user_name,
            u.image_profile as user_avatar
          FROM posts p
          JOIN users u ON p.user_id = u.id
          WHERE (p.title ILIKE ${'%' + search + '%'} OR p.genre ILIKE ${'%' + search + '%'})
          ORDER BY p.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;
      } else {
        posts = await sql`
          SELECT 
            p.id, 
            p.title, 
            p.image, 
            p.type, 
            p.genre, 
            p.user_id, 
            p.created_at,
            u.name as user_name,
            u.image_profile as user_avatar
          FROM posts p
          JOIN users u ON p.user_id = u.id
          ORDER BY p.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;
      }

      // 🔹 Total de posts (para paginação)
      let totalQuery;
      if (Userid && search) {
        totalQuery = await sql`
          SELECT COUNT(*)::int as count 
          FROM posts 
          WHERE user_id = ${Userid} 
          AND (title ILIKE ${'%' + search + '%'} OR genre ILIKE ${'%' + search + '%'})
        `;
      } else if (Userid) {
        totalQuery = await sql`
          SELECT COUNT(*)::int as count 
          FROM posts 
          WHERE user_id = ${Userid}
        `;
      } else if (search) {
        totalQuery = await sql`
          SELECT COUNT(*)::int as count 
          FROM posts 
          WHERE (title ILIKE ${'%' + search + '%'} OR genre ILIKE ${'%' + search + '%'})
        `;
      } else {
        totalQuery = await sql`
          SELECT COUNT(*)::int as count 
          FROM posts
        `;
      }

      const [{ count }] = totalQuery;
      const totalPages = Math.ceil(count / limit);

      return reply.send({
        posts,
        pagination: {
          total: count,
          page,
          totalPages
        }
      });

    } catch (err) {
      console.error(err);
      return reply.status(500).send({ err });
    }
  });
}
