const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();

let corsOptions = {
  origin: "",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/fortuneTell", async function (req, res) {
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    // max_tokens: 100,
    // temperature: 0.5,
    messages: [
      { role: "system", content: "Hello world" },
      { role: "user", content: "Hello world" },
    ],
  });
  let fortune = chatCompletion.data.choices[0].message["content"];
  console.log(fortune);
  res.send(fortune);
});

app.listen(3000);
