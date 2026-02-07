const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


app.post("/chat", (req, res) => {
  let msg = req.body.message.toLowerCase();


  msg = msg.replace(/\bu\b/g, "you");

  let reply = "";

  if (msg.includes("what can you do") || msg.includes("help")) {
    reply = "I can chat with you, give wellness tips, help with stress, mood, sleep, and daily habits. What would you like help with?";
  }

  else if (msg.includes("sad") || msg.includes("mad") || msg.includes("angry")) {
    reply = random([
      "I'm sorry you're feeling that way. Want to talk about it?",
      "That sounds hard. I'm here to listen.",
      "It’s okay to feel upset. What happened?"
    ]);
  }

  else if (msg.includes("stress") || msg.includes("tired")) {
    reply = random([
      "Stress can be heavy. Try a slow breath with me.",
      "Want a quick relaxation tip?",
      "What’s causing the stress right now?"
    ]);
  }

  else if (msg.includes("happy") || msg.includes("good")) {
    reply = random([
      "That’s nice to hear! What made you happy?",
      "I love that energy. Tell me more.",
      "Positive moments matter. Want to share?"
    ]);
  }

  else {
    reply = random([
      "Tell me more about that.",
      "How does that make you feel?",
      "I'm listening."
    ]);
  }

  res.json({ reply });
});

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


app.listen(3000, () =>
  console.log("✅ Server running at http://localhost:3000")
);
