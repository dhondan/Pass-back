import admin from "firebase-admin";

// Pega a configuração do Firebase a partir da variável de ambiente
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

// Inicializa o app do Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://projeto-a99a9-default-rtdb.firebaseio.com",
});

export const app = admin;
