import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

const DEEPSEEK_API_KEY = "sk-7ca0429affac49ec81b99f40567e5143";

app.post("/chat", async (req, res) => {
    try {
        const { player, message } = req.body;

        const response = await axios.post(
            "https://api.deepseek.com/v1/chat/completions",
            {
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: "Ты NPC в Roblox игре. Отвечай кратко и естественно."
                    },
                    {
                        role: "user",
                        content: `${player}: ${message}`
                    }
                ],
                temperature: 0.8
            },
            {
                headers: {
                    "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const reply = response.data.choices[0].message.content;

        res.send(reply);

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send("Ошибка нейросети");
    }
});

app.listen(3000, () => {
    console.log("Backend запущен на 3000");
});