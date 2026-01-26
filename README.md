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

---

## ▶️ Como Rodar o Projeto

### 📄 Configuração do arquivo `.env`

Para o funcionamento correto do backend, **é obrigatório** criar um arquivo `.env` na raiz do projeto com **todas as variáveis abaixo**.

```env
PGHOST=""
PGDATABASE=""
PGUSER=""
PGPASSWORD=""
PGSSLMODE="require"
PGCHANNELBINDING=""

PORT=""
HOST=""

SECRETKEY="" --chave secreta de criptografia para todo seu back
ROTA=""

FIREBASE_CONFIG='{
  "type": "",
  "project_id": "",
  "private_key_id": "",
  "private_key": "",
  "client_id": "",
  "auth_uri": "",
  "token_uri": "",
  "auth_provider_x509_cert_url": "",
  "client_x509_cert_url": "",
  "universe_domain": ""
}'

FIREBASE_URL=""

DEV="true"
```
## 🧾 Explicação rápida das variáveis

* PGHOST → Host do banco PostgreSQL (Neon)

* PGDATABASE → Nome do banco de dados

* PGUSER → Usuário do banco

* PGPASSWORD → Senha do banco

* PGSSLMODE → Modo SSL (obrigatório no Neon)

* PGCHANNELBINDING → Configuração extra de segurança do PostgreSQL

* PORT → Porta onde o servidor vai rodar

* HOST → Host do servidor (ex: localhost)

* SECRETKEY → Chave secreta usada para criptografia e JWT em todo o backend

* ROTA → Rota base ou identificador interno do sistema

* FIREBASE_CONFIG → Credenciais do Firebase (JSON da conta de serviço)

* FIREBASE_URL → URL do Firebase Realtime Database ou Firestore

* DEV → Define se o ambiente está em modo desenvolvimento

### Lembre-se de aplicar as informações do DB onde você vai guardar as informações
<img width="1545" height="878" alt="image" src="https://github.com/user-attachments/assets/8fa99d08-198a-4cc6-b49b-5c08b29f75f9" />

## Regras para um bom funcionamento
* A variavel `"dev"` sempre deve ser false em caso de produto e sempre `"true"` em desenvolvimento
* Coloque sempre um Json na variavel `"FIREBASE_CONFIG="` 

### 🔗 Onde conseguir essas informações

#### 🟦 Neon (PostgreSQL)

* Acesse: **[https://neon.tech](https://neon.tech)** `apenas como exemplo, mas você pode usar qualquer um`
* Crie um projeto
* Copie as credenciais de conexão
* Preencha: `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`
* Utilize **NODE_ENV=production** (obrigatório no Neon)

#### 🔥 Firebase

* Acesse: **[https://console.firebase.google.com](https://console.firebase.google.com)**
* Crie um projeto
* Vá em **Configurações do Projeto → Contas de serviço**
* Gere uma **chave privada**
* Use os dados no `FIREBASE_CONFIG` ou nas variáveis separadas

### ▶️ Iniciar o servidor

```bash
npm install
```

2. Configure o `.env`:

```env
SECRETKEY=suachavesecreta
DATABASE_URL=postgres_neon_url
FIREBASE_KEY=chave_firebase
```
---

## 📌 Observações Finais

Este backend foi desenvolvido com foco em **qualidade, clareza e desempenho**, pronto para evoluir para um sistema maior (ex: rede social, blog, plataforma de conteúdo).

Se quiser expandir:

* Cache com Redis
* Rate limit
* Upload de mídia
* WebSockets
