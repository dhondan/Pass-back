// lista de imports
import Fastify from 'fastify'
import { CriarPosts } from './controls/PostsRouter/posts/CriarPosts.js'
import { EditarPost } from './controls/PostsRouter/posts/EditarPost.js'
import { DeletarPost } from './controls/PostsRouter/posts/DeletarPost.js'
import { CriarUser } from './controls/UsersRouter/CriarUser.js'
import { Login } from './controls/UsersRouter/Login.js'
import { GetPostInfo } from './controls/PublicRouter/GetPostInfo.js'
import { GetUserInfo } from './controls/UsersRouter/GetUserInfo.js'
import { EditUser } from './controls/UsersRouter/EditUser.js'
import { fastifyCookie } from "@fastify/cookie"
import { Logout } from './controls/UsersRouter/Sair.js'
import { GetUser } from './controls/UsersRouter/GetUser.js'
import { ListarPosts } from './controls/PublicRouter/ListarPosts.js'
import { CriarComentario } from './controls/PostsRouter/comments/CriarComentario.js'
import { ListarComentarios } from './controls/PublicRouter/ListarComentarios.js'
import { ListarRespostas } from './controls/PublicRouter/ListarRespostasComentarios.js'
import { TokenValidation } from './controls/UsersRouter/TokenValidation.js'

//posts
import { registerView } from './controls/PostsRouter/functions/registerView.js'
import { LikePost } from './controls/PostsRouter/posts/LikePost.js'
import { getLikePost } from './controls/PublicRouter/GetLikePost.js'
//comments
import { LikeComentario } from './controls/PostsRouter/comments/LikeComentario.js'
import { GetPublicUser } from './controls/PublicRouter/GetPublicUser.js'



import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'

const server = Fastify()

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
console.log(token)
    try {
        const token_decode = server.jwt.verify(token);
        request.user = token_decode;
        console.log(request.user)
    } catch (err) {
        return reply.status(401).send({ error: err });
    }
})


server.register(cors, {
  origin: process.env.ROTA || 'http://localhost:3000/',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
})

// Registrar rotas de posts > Tudo que está dentro de src/postsRotas será registrado aqui

// Criar post
server.register(CriarPosts)
// Listar posts
server.register(ListarPosts)
// Editar post
server.register(EditarPost)
// Excluir post
server.register(DeletarPost)
// Pegar informações do post em especifico
server.register(GetPostInfo)
//listar comentarios
server.register(ListarComentarios)
//valida token
server.register(TokenValidation)

//funções posts

//registrar visualização
server.register(registerView)
//get quantidade de likes de um post
server.register(getLikePost)
//like post
server.register(LikePost)
//funções comments
//like comentario
server.register(LikeComentario)
//criar comentario
server.register(CriarComentario)
//listar respostas de comentarios
server.register(ListarRespostas)
//pegar informações públicas do usuario
server.register(GetPublicUser)



// Criar User
server.register(CriarUser)
// Editar user
server.register(EditUser)
// Fazer login
server.register(Login)
//valida informações (Sem uso)
server.register(GetUserInfo)
//sair da conta
server.register(Logout)
//Pega informações públicas do usuario
server.register(GetUser)



// Iniciar o servidor

server.listen({ host: process.env.HOST || '0.0.0.0',   port: process.env.PORT || 3333 })


