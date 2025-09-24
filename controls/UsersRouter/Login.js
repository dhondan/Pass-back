import { sql } from "../../db.js";
import bcrypt from "bcrypt";

export async function Login(server, opts) {
  server.post("/login", async (request, reply) => {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return reply.status(400).send({ message: "Email e senha são obrigatórios" });
      }

      const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;

      if (!user) {
        return reply.status(404).send({ message: "Usuário não encontrado" });
      }

      const senhaValida = await bcrypt.compare(password, user.password);

      if (!senhaValida) {
        return reply.status(401).send({ message: "Senha incorreta" });
      }

      const token = server.jwt.sign({ id: user.id }, { expiresIn: "1h" });

      reply
        .setCookie("token", token, {
          httpOnly: true,
          secure: false,  
          sameSite: "lax",
          maxAge: 60 * 60,
          path: "/",
        })
        .status(200)
        .send({
          message: "Login feito com sucesso",
          user: { id: user.id},
        });

      console.log("✅ Login realizado com sucesso:", email);
    } catch (err) {
      console.error("❌ Erro no login:", err);
      return reply.status(500).send({ message: "Erro no servidor" });
    }
  });
}
