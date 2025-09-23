var admin = require("firebase-admin");

var serviceAccount = require("./firebaseAdminSDK.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://projeto-a99a9-default-rtdb.firebaseio.com"
});

module.exports = { app: admin };
