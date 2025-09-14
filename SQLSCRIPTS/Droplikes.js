import {sql} from "../db.js";


await sql `
    DROP TABLE IF EXISTS post_likes

`.then (() => {
    console.log("Tabela 'users' removida com sucesso.");
})