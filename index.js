import express from 'express';
import "dotenv/config";

const app = express();
console.log(process.env.PORT)

app.get("/", (req, res) => {
    res.send("Hello world")
});

app.listen(port, () => {
    console.log(`Démarrage de l'API sur le localhost:${process.env.PORT}`)
})