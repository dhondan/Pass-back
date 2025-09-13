import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();


const {  PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGSSLMODE, PGCHANNELBINDING } = process.env;
console.log(PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGSSLMODE, PGCHANNELBINDING);
const url = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=${PGSSLMODE}&channelBinding=${PGCHANNELBINDING}`;

export const sql = postgres(url, {ssl: 'require'});

