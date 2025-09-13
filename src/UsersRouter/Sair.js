export async function Logout(server, opts) {
  server.get('/logout', async (request, reply) => {
    reply.clearCookie("token", { path: "/" }).send({ message: "Logout realizado" });
    console.log("saiu")
  });
}