import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not set in environment variables");
}

app.post("/chat", async (req, res) => {
    try {
        const { message, worldState } = req.body;

        if (!message || !worldState) {
            return res.status(400).json({ error: "message and worldState are required" });
        }

        const prompt = `
Человек: ${message}

Текущее состояние мира (JSON):
${JSON.stringify(worldState, null, 2)}

Отвечай как NPC. Учитывай состояние мира при формировании ответа.
`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": Bearer ${GROQ_API_KEY}
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "Ты NPC в Roblox. Отвечай естественно, как персонаж в игре."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });

        const data = await response.json();

        if (!data.choices || !data.choices[0]) {
            console.error("Groq error:", data);
            return res.status(500).json({ error: "Invalid response from Groq" });
        }

        res.json({
            reply: data.choices[0].message.content
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
