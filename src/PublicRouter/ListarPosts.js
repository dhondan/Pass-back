import { sql } from "../../db.js";

export async function ListarPosts(server, opts) {

  server.get('/public/posts', async (request, reply) => {
    try {

      const Userid = request.query.id;
      let posts
      console.log(Userid)

      if (Userid) {
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
  LIMIT 20
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
  LIMIT 20
`;
      }

      return reply.send({ posts });

    } catch (err) {
      return reply.send({ err });
    }
  });
}