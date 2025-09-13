import {sql} from "../db.js";


await sql `
    DROP TABLE IF EXISTS users

`.then (() => {
    console.log("Tabela 'users' removida com sucesso.");
})