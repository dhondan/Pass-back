import {sql} from "../db.js";

    await sql`
  CREATE TABLE IF NOT EXISTS Like_Posts (
    post_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id) -- cada user só pode dar 1 like por post
  )
`.then(() => {
      console.log("Tabela 'posts' criada com sucesso.");
    })
 
 