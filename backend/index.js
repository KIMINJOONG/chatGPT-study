const { Configuration, OpenAIApi } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function apiCall() {
  const chatCompletion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    // max_tokens: 100,
    // temperature: 0.5,
    messages: [
      { role: "system", content: "Hello world" },
      { role: "user", content: "Hello world" },
    ],
  });

  console.log(chatCompletion.data.choices[0].text);
}

apiCall();
