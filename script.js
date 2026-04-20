const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

/* 🔹 STORE CONVERSATION HISTORY */
let messages = [
  {
    role: "system",
    content:
      "You are a L’Oréal beauty assistant. Only answer questions about L’Oréal products, skincare routines, haircare, and beauty recommendations. If a question is unrelated, politely refuse and redirect to beauty topics."
  }
];

/* Initial message */
appendMessage("ai", "👋 Hello! Ask me anything about L’Oréal products, skincare, or beauty routines.");

/* Append messages */
function appendMessage(role, text) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("msg", role);
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Handle submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userText = userInput.value.trim();
  if (!userText) return;

  /* Display user message */
  appendMessage("user", userText);

  /* EXTRA CREDIT: show question above response */
  const questionDiv = document.createElement("div");
  questionDiv.classList.add("msg");
  questionDiv.style.fontWeight = "bold";
  questionDiv.textContent = `You asked: ${userText}`;
  chatWindow.appendChild(questionDiv);

  userInput.value = "";

  /* Add to history */
  messages.push({ role: "user", content: userText });

  try {
  const response = await fetch("https://08-prj-loreal-chatbot.nghanathe1.workers.dev/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ messages })
  });

  const data = await response.json();

  console.log("Worker response:", data);

  if (!response.ok) {
    throw new Error(data.error?.message || "Worker request failed");
  }

  const aiReply = data.choices?.[0]?.message?.content;

  if (!aiReply) {
    throw new Error("No response from AI");
  }

  appendMessage("ai", aiReply);

  messages.push({ role: "assistant", content: aiReply });

} catch (error) {
  console.error(error);
  appendMessage("ai", "⚠️ Error connecting to beauty advisor. Please try again.");
}
