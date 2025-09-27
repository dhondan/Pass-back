export async function Logout(server, opts) {
  server.get('/logout', async (request, reply) => {
    reply
      .setCookie("token", "", {
        httpOnly: true,
        secure: true,     // se estiver em HTTPS
        sameSite: "none",  // ou 'none' se for cross-site
        path: "/",
        maxAge: 0         // expira imediatamente
      })
      .send({ message: "Logout realizado" });

    console.log("saiu");
  });
}
