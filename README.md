# 🚀 Backend API – Projeto de Posts, Comentários e Usuários

Este repositório contém o **backend completo** da aplicação, desenvolvido com foco em **organização, escalabilidade e desempenho**. A arquitetura foi pensada para separar responsabilidades, facilitar manutenção e permitir evolução futura do sistema.

O projeto utiliza **Fastify** como servidor HTTP, **JWT** para autenticação, **Neon (PostgreSQL)** como banco de dados principal e **Firebase** especificamente para o gerenciamento de comentários, garantindo maior performance e flexibilidade.

---

## 🧱 Tecnologias Utilizadas

* **Node.js**
* **Fastify** (framework HTTP rápido e leve)
* **Fastify JWT** (autenticação via token)
* **PostgreSQL (Neon)** – banco principal
* **Firebase** – banco dedicado aos comentários
* **dotenv** – variáveis de ambiente

---
## 🔐 Autenticação e Segurança

* Autenticação feita via **JWT**
* Tokens são armazenados em **cookies**
* Middleware global (`preHandler`) protege rotas privadas
* Rotas públicas como `/login` e `/createUser` são liberadas

```js
server.addHook("preHandler", async (request, reply) => {
  const publicroutes = ["/login", "/createUser"];
  const publicPrefixes = ["/public"];

  if (publicroutes.includes(request.url)) return;
  if (publicPrefixes.some(prefix => request.url.startsWith(prefix))) return;

  const token = request.cookies?.token;
  // validação do token
});
```

---

## 🗄️ Banco de Dados

### 🟦 PostgreSQL (Neon)

Utilizado como **banco principal**, armazenando:

* Usuários
* Posts
* Likes de posts (em tabela separada)
* Estatísticas

👉 **Like de posts em tabela separada**: decisão tomada para melhorar consultas, evitar duplicidade e escalar melhor o sistema.

---

### 🔥 Firebase (Comentários)

Os **comentários não ficam no PostgreSQL**.
Eles são armazenados no **Firebase**, o que traz vantagens como:

* Melhor performance em leitura
* Estrutura flexível para respostas aninhadas
* Menor carga no banco relacional

📌 O Firebase é usado **exclusivamente** para:

* Comentários
* Respostas de comentários
* Likes em comentários

---

## 🧩 Rotas Principais

### 👤 Usuários

* Criar usuário
* Login
* Editar perfil
* Buscar informações
* Validação de token

### 📝 Posts

* Criar post
* Editar post
* Deletar post
* Listar posts
* Visualizar post
* Registrar visualizações

### ❤️ Likes

* Like/unlike em posts
* Ver posts curtidos
* Estatísticas de likes

### 💬 Comentários (Firebase)

* Criar comentário
* Curtir comentário
* Listar comentários
* Respostas encadeadas

---

## ⚙️ Organização e Performance

Este backend foi pensado para:

* Separar responsabilidades por domínio
* Facilitar manutenção
* Melhorar performance em pontos críticos
* Permitir escalabilidade futura

💡 Decisões importantes:

* Comentários fora do banco relacional
* Likes desacoplados dos posts
* Funções utilitárias isoladas
* Rotas bem divididas (Public / Users / Posts)

---

## ▶️ Como Rodar o Projeto

1. Instale as dependências:

```bash
npm install
```

2. Configure o `.env`:

```env
SECRETKEY=suachavesecreta
DATABASE_URL=postgres_neon_url
FIREBASE_KEY=chave_firebase
```

3. Inicie o servidor:

```bash
node server.js
```

---

## 📌 Observações Finais

Este backend foi desenvolvido com foco em **qualidade, clareza e desempenho**, pronto para evoluir para um sistema maior (ex: rede social, blog, plataforma de conteúdo).

Se quiser expandir:

* Cache com Redis
* Rate limit
* Upload de mídia
* WebSockets
