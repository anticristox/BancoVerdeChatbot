const chatFab = document.getElementById("chat-fab");
const chatWindow = document.getElementById("chat-window");
const chatClose = document.getElementById("chat-close");
const chatBody = document.getElementById("chat-body");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

function appendMessage(role, text) {
  const row = document.createElement("div");
  row.className = `chat-row ${role}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  row.appendChild(bubble);
  chatBody.appendChild(row);
  chatBody.scrollTop = chatBody.scrollHeight;
}

chatFab.addEventListener("click", () => {
  const isOpen = chatWindow.classList.contains("open");
  if (isOpen) {
    chatWindow.classList.remove("open");
  } else {
    chatWindow.classList.add("open");
  }
});

chatClose.addEventListener("click", () => {
  chatWindow.classList.remove("open");
});

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = "";

  appendMessage("user", text);

  // Indicador simples de "pensando"
  const thinkingRow = document.createElement("div");
  thinkingRow.className = "chat-row bot";
  const thinkingBubble = document.createElement("div");
  thinkingBubble.className = "bubble";
  thinkingBubble.textContent = "...";
  thinkingRow.appendChild(thinkingBubble);
  chatBody.appendChild(thinkingRow);
  chatBody.scrollTop = chatBody.scrollHeight;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: "widget-user", message: text }),
    });

    const data = await res.json();
    chatBody.removeChild(thinkingRow);

    if (data && data.reply) {
      appendMessage("bot", data.reply);
    } else {
      appendMessage("bot", "Não consegui entender a resposta do servidor.");
    }
  } catch (err) {
    chatBody.removeChild(thinkingRow);
    appendMessage(
      "bot",
      "Ocorreu um erro ao falar com o servidor. Tente novamente mais tarde."
    );
  }
});
