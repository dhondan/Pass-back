var admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

initializeApp({
  credential: _credential.cert(serviceAccount),
  databaseURL: "https://projeto-a99a9-default-rtdb.firebaseio.com"
});

export const app = admin;
