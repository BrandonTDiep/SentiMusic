const OpenAI = require("openai");


const client = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});
  

module.exports = {
    getGenres: async (req, res) => {
        const mood = req.body.mood
        //const { mood } = req.body;

        if (!mood) {
          return res.status(400).json({ error: "Mood is required" });
        }
      
        try {
          const response = await client.chat.completions.create({
            model: process.env.MODEL,
            messages: [
              { role: "system", content: process.env.OPENAI_PROMPT },
              { role: "user", content: `${mood}.` },
            ],
          });
          const recommendation = response.choices[0].message.content;
          res.json({ recommendation });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Failed to fetch recommendation." });
        }
    },
    
}


