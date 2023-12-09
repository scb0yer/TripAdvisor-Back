require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);

const client = mailgun.client({
  username: "Sophie Boyer",
  key: process.env.API_KEY_MAILGUN,
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome" });
});

app.post("/form", async (req, res) => {
  console.log("route post");

  console.log("mon body =>", req.body);

  try {
    // Je crée un objet messageData qui contient les informations dont mailgun a besoin : infos de l'envoyeur, objet , text du mail et destinataire
    const messageData = {
      from: `${req.body.firstname} ${req.body.lastname} <${req.body.email}>`,
      to: process.env.MY_EMAIL,
      subject: "Hello",
      text: req.body.message,
    };

    // J'envoie un message via mailgun et je stocke dans response ce que me renvoie Mailgun =>
    const response = await client.messages.create(
      process.env.DOMAIN_MAILGUN,
      messageData
    );

    console.log("response>>", response);
    // je répond response à mon front
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error);
  }

  res.status(200).json({ message: "infos bien reçues" });
});

app.listen(3002, () => {
  console.log("server has started");
});
