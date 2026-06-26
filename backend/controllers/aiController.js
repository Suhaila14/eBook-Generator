const { GoogleGenAI } = require("@google/genai"); //Import Google's AI system.

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateWithRetry(prompt, retries = 3) {
  for (let i = 0; i < retries; i++) {
    console.log(`Attempt ${i + 1} of ${retries}`);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });

      console.log("Gemini Success");

      return response;
    } catch (err) {
      console.log("Gemini Error:", err.status, err.message);

      if (err.status === 503 && i < retries - 1) {
        const delay = Math.pow(2, i) * 2000;

        console.log(`Waiting ${delay / 1000} seconds...`);

        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw err;
    }
  }
}
const generateOutline = async (req, res) => {
  try {
    const { topic, style, numChapters, description } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "please provide a topic" });
    }
    const prompt = `you are an expert book outline generator. Create a comprehensive book outline based on the following requirements:
    Topic:"${topic}"
    ${description ? `Description: ${description}` : ""}
    Writing Style: ${style}
    Number of Chapters:${numChapters || 5}

    Requirements:
    1. Generate exactly ${numChapters || 5} chapters
    2. Each chapter title should be clear, engaging, and follow a logical progression
    3. Each chapter description should be 2-3 sentances explaining what the chapter covers
    4. Ensure chapters build upon each other coherently
    5. Match the "${style}" writing style in your titles and descriptions

    Output Format:
    Return ONLY a valid JSON array with no additional text, markdown, or formatting. Each object must have exactly two keys: "title" and "description".
    
    Example structure:
    [
    {
    "title": "chapter 1: Introduction to the Topic",
    "description": "A comprehensive overview introducing the main concepts. Sets the foundation for understanding the subject matter." 
    },
    {
    "title": "Chapter 2:Core Principles",
    "description": "Explores the fundamental principles and theories. Provides detailed examples and real-world applications."
    }
    ]

    Generate the outline now:`;

    /*const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });*/

    const response = await generateWithRetry(prompt);

    const text = response.text;

    const startIndex = text.indexOf("[");
    const endIndex = text.lastIndexOf("]");

    if (startIndex === -1 || endIndex === -1) {
      console.error("Could not find JSON array in AI response", text);
      return res
        .status(500)
        .json({ message: "failed to parse AI response, no JSON array found." });
    }
    const jsonString = text.substring(startIndex, endIndex + 1);

    try {
      const outline = JSON.parse(jsonString); //ex: "[{..}]" to [{ title:"..", descr:".."}]
      res.status(200).json({ outline });
    } catch (e) {
      console.error("Failed to parse AI response:", jsonString);
      res.status(500).json({
        message:
          "Failed to generate a valid outline. The AI response was not valid JSON.",
      });
    }
  } catch (error) {
    console.error("Error generating outline:", error);
    res
      .status(500)
      .json({ message: "Server error during AI outline generation" });
  }
};

const generateChapterContent = async (req, res) => {
  try {
    console.log("=== CHAPTER REQUEST ===");
    console.log(req.body);
    const { chapterTitle, chapterDescription, style } = req.body;

    if (!chapterTitle) {
      return res
        .status(400)
        .json({ message: "pleases provide a chapter title" });
    }

    const prompt = `You are an expert writer specializing in ${style} content. Write a complete chapter for a book with the following specifications
    Chapter Title: "${chapterTitle}"
    ${chapterDescription ? `Chapter Description: ${chapterDescription}` : ""}
    Writing Style:${style}
    Target Length: Comprehensive and detailed (aim for 800-1500 words)

    Requirements:
    1. Write in a ${style.toLowerCase()} tone throughout the chapter
    2. Structure the content with clear sections and smooth transitions
    3. Include relevant examples, explanations, or anecdotes as appropriate for the style
    4. Ensure the content flows logically from introduction to conclusion
    5. Make the content engaging and valuable to readers
    ${chapterDescription ? "6.Cover all points mentioned in the chapter description" : ""}

    Format Guidelines:
    - Start with a compelling opening paragraph
    - Use clear paragraph breaks for readability
    - Include subheadings if appropriate for the content length
    - End with a strong conclusion or transition to the next chapter
    - Write in plain text without markdown formatting

    Begin writing the chapter content now:`;

    /*const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });*/

    const response = await generateWithRetry(prompt);

    res.status(200).json({ content: response.text });
  } catch (error) {
    console.log("========== GEMINI ERROR ==========");
    console.dir(error, { depth: null });

    /*console.log("Message:", error.message);
    console.log("Stack:", error.stack);*/

    if (error.status === 503) {
      return res.status(503).json({
        message:
          "Gemini AI is currently busy. Please try again in a few seconds.",
      });
    }

    res.status(500).json({
      message: error.message,
      details: error,
    });
  }
};

module.exports = {
  generateOutline,
  generateChapterContent,
};
