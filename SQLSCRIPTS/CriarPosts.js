import {sql} from "../db.js";


    await sql`
    CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE,
    first_paragraph TEXT NOT NULL,
    second_paragraph TEXT,
    third_paragraph TEXT,
    fourth_paragraph TEXT,
    fifth_paragraph TEXT,
    sixth_paragraph TEXT,
    image VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    genre VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )`.then(() => {
      console.log("Tabela 'posts' criada com sucesso.");
    })
 
 