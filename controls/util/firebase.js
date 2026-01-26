import admin from "firebase-admin";
import dotenv from "dotenv";

// Pega a configuração do Firebase a partir da variável de ambiente
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

// Inicializa o app do Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URL,
});

export const app = admin;
