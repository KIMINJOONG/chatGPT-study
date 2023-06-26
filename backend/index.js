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
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/fortuneTell", async function (req, res) {
  let { userMessages, assistantMessages } = req.body;
  let messages = [
    { role: "system", content: "당신은 세계최고의 점성술사입니다." },
    { role: "user", content: req.body.message },
  ];

  while (userMessages.length != 0 && assistantMessages.length != 0) {
    if (userMessages.length != 0) {
      messages.push(
        JSON.parse(
          `{"role": "user", "content": ${userMessages
            .shift()
            .replace(/\n/g, "")}},`
        )
      );
    }

    if (assistantMessages.length != 0) {
      messages.push(
        JSON.parse(
          `{"role": "user", "content": ${assistantMessages
            .shift()
            .replace(/\n/g, "")}},`
        )
      );
    }
  }
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    // max_tokens: 100,
    // temperature: 0.5,
    messages: messages,
  });

  let fortune = chatCompletion.data.choices[0].message["content"];
  console.log(fortune);
  res.json({ assistant: fortune });
});

app.listen(3000);
