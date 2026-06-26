const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateEbookContent = async (title, topic) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an ebook writer.",
      },
      {
        role: "user",
        content: `Write a detailed ebook about ${topic} titled ${title}`,
      },
    ],
  });

  return response.choices[0].message.content;
};

module.exports = generateEbookContent;
