// lista de imports
import Fastify from 'fastify'
import { DatabaseMemory } from './database-memory.js'
import { CriarPosts } from './src/PostsRouter/posts/CriarPosts.js'
import { EditarPost } from './src/PostsRouter/posts/EditarPost.js'
import { DeletarPost } from './src/PostsRouter/posts/DeletarPost.js'
import { CriarUser } from './src/UsersRouter/CriarUser.js'
import { Login } from './src/UsersRouter/Login.js'
import { TokenValidation } from './src/UsersRouter/TokenValidation.js'
import { GetPostInfo } from './src/PublicRouter/GetPostInfo.js'
import { GetUserInfo } from './src/UsersRouter/GetUserInfo.js'
import { EditUser } from './src/UsersRouter/EditUser.js'
import { fastifyCookie } from "@fastify/cookie"
import { Logout } from './src/UsersRouter/Sair.js'
import { GetUser } from './src/UsersRouter/GetUser.js'
import { ListarPosts } from './src/PublicRouter/ListarPosts.js'
import { CriarComentario } from './src/PostsRouter/comments/CriarComentario.js'
import { ListarComentarios } from './src/PublicRouter/ListarComentarios.js'

//posts
import { registerView } from './src/PostsRouter/functions/registerView.js'
import { LikePost } from './src/PostsRouter/posts/LikePost.js'
//comments
import { LikeComentario } from './src/PostsRouter/comments/LikeComentario.js'


import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'

const server = Fastify()
const db = new DatabaseMemory()
// Mock banco de dados em memória
export { db }

server.register(fastifyCookie);

server.register(rateLimit, {
    max: 1000000,
    timeWindow: '1 minute'
})

server.register(fastifyJwt, {
    secret: process.env.SECRETKEY // troque por variável de ambiente
});



// server.addHook('preHandler', (request, reply, done) => {
//     const maxsize = 500 * 1024;
//     if (request.raw.socket.bytesRead > maxsize) {
//         return reply.status(413).send({ error: 'erro interno' });
//     }
// })

server.addHook("preHandler", async (request, reply) => {

    const publicroutes = ["/login", "/createUser"];
    const publicPrefixes = ["/public"];

    if (publicroutes.includes(request.url)) {
        return
    }

    if (publicPrefixes.some(prefix => request.url.startsWith(prefix))) return;

    //  const authHeader = request.headers.authorization;

    // if(!authHeader) {
    //     return reply.status(401).send({erro: "Erro interno"})
    // }

    const token = request.cookies?.token; // pega token do 

    try {
        const token_decode = server.jwt.verify(token);
        request.user = token_decode;
    } catch (err) {
        return reply.status(401).send({ error: err });
    }
})


server.register(cors, {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
})

// Registrar rotas de posts > Tudo que está dentro de src/postsRotas será registrado aqui

// Criar post
server.register(CriarPosts, { db })
// Listar posts
server.register(ListarPosts, { db })
// Editar post
server.register(EditarPost, { db })
// Excluir post
server.register(DeletarPost, { db })
// Pegar informações do post em especifico
server.register(GetPostInfo, { db })
//listar comentarios
server.register(ListarComentarios, { db })


//funções posts
//registrar visualização
server.register(registerView, { db })
//like post
server.register(LikePost, { db })
//funções comments
//like comentario
server.register(LikeComentario, { db })
//criar comentario
server.register(CriarComentario, { db })



// Criar User
server.register(CriarUser, { db })
// Editar user
server.register(EditUser, { db })
// Fazer login
server.register(Login, { db })
//valida informações (Sem uso)
server.register(TokenValidation, { db })
//pega informações de um user em especifico
server.register(GetUserInfo, { db })
//sair da conta
server.register(Logout, { db })
//Pega informações públicas do usuario
server.register(GetUser, { db })



// Iniciar o servidor

server.listen({ port: 3333 })


