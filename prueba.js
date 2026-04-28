import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

app.get("/test", (req, res) => {
  res.json({
    status: "ok",
    message: "API funcionando correctamente"
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});