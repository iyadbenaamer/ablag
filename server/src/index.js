import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// server's configurations

const app = express();
const PORT = process.env.PORT || 4000;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

if (!MISTRAL_API_KEY) {
  console.warn("Warning: MISTRAL_API_KEY is not set. Set it in server/.env");
}

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "1mb" }));

/*
  rephrase endpoint where the text intended to 
  be rephrased is proccesed by an API call to Mistral AI API
*/
app.post("/api/rephrase", async (req, res) => {
  try {
    let { text } = req.body;
    text = text?.toString().trim();
    if (!text || typeof text !== "string" || text.length === 0) {
      return res.status(400).json({ error: "يرجى إدخال نص صالح" });
    }

    if (text.length > 2000) {
      return res.status(400).json({ error: "الحد الأقصى للنص هو 2000 حرف" });
    }

    // Construct prompt for Arabic rephrasing and grammar improvement
    const systemPrompt = `أنت مساعد لغوي عربي محترف. أعِد صياغة النص التالي بصياغة فصيحة واحترافية، صحّح الأخطاء النحوية والإملائية،
        وحافظ على المعنى الأصلي دون إضافة معلومات جديدة. قدّم النتيجة فقط دون شرح.`;

    const userPrompt = `النص الأصلي:\n${text}\n\nالنتيجة المطلوبة: إعادة صياغة فصيحة واحترافية مع تحسين الأسلوب.`;

    ("النص الأصلي: راح عليا وقت الامتحان يومتها وياريت الدكتورة تخليني نعاوده مرة أخرى ،النتيجة المطلوبة: إعادة صياغة فصيحة واحترافية مع تحسين الأسلوب");

    // Mistral API call (chat)
    const response = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      {
        model: "mistral-large-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${MISTRAL_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    const output = response?.data?.choices?.[0]?.message?.content || "";
    return res.json({ original: text, rephrased: output });
  } catch (err) {
    console.error("Mistral API error:", err?.response?.data || err.message);
    const status = err?.response?.status || 500;
    res.status(status).json({ error: "حدث خطأ أثناء معالجة الطلب" });
  }
});

// the entry point for the server
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
