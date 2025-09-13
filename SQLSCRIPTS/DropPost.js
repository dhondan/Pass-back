import {sql} from "../db.js";


await sql `
    DROP TABLE IF EXISTS posts

`.then (() => {
    console.log("Tabela 'posts' removida com sucesso.");
})