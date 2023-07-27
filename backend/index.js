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
  let { myDateTime, userMessages, assistantMessages } = req.body;
  let todayDateTime = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
  let messages = [
    { role: "system", content: "당신은 세계최고의 점성술사입니다." },
    { role: "user", content: req.body.message },
    {
      role: "assistant",
      content:
        "안녕하세요 저는 챗도지입니다. 운세와 점성술에 관한 질문이 있으신가요? 어떤것이든 물어보세요. 최선을 다해 답변해드리겠습니다.",
    },
    {
      role: "user",
      content: `저의 생년월일과 태어난 시간은 ${myDateTime} 입니다. 오늘은 ${todayDateTime}입니다.`,
    },
    {
      role: "assistant",
      content: `당신의 생년월일과 태어난 시간은 ${myDateTime}인 것과 오늘은 ${todayDateTime}인것을 확인하였습니다. 운세에 대해 어떤것이든 물어보세요.`,
    },
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
