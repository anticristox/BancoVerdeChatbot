const logEl = document.getElementById("chat-log");
const formEl = document.getElementById("chat-form");
const inputEl = document.getElementById("chat-input");
const statusEl = document.getElementById("status-indicator");

function appendMessage(role, text) {
  const row = document.createElement("div");
  row.className = `msg-row ${role}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  const p = document.createElement("p");
  p.textContent = text;

  bubble.appendChild(p);
  row.appendChild(bubble);
  logEl.appendChild(row);
  logEl.scrollTop = logEl.scrollHeight;
}

async function checkHealth() {
  try {
    const res = await fetch("/health");
    if (!res.ok) throw new Error();
    const data = await res.json();
    statusEl.textContent = `Online · cliente: ${data.client_id}`;
  } catch (e) {
    statusEl.textContent = "Offline";
    statusEl.style.borderColor = "rgba(239, 68, 68, 0.7)";
    statusEl.style.color = "#fecaca";
    statusEl.style.setProperty("--status-dot", "#ef4444");
  }
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;

  appendMessage("user", text);
  inputEl.value = "";

  const thinkingRow = document.createElement("div");
  thinkingRow.className = "msg-row bot";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = "...";
  thinkingRow.appendChild(bubble);
  logEl.appendChild(thinkingRow);
  logEl.scrollTop = logEl.scrollHeight;

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: "demo-user", message: text }),
    });

    const data = await res.json();
    logEl.removeChild(thinkingRow);

    if (data && data.reply) {
      appendMessage("bot", data.reply);
    } else {
      appendMessage("bot", "Não consegui entender a resposta do servidor.");
    }
  } catch (err) {
    logEl.removeChild(thinkingRow);
    appendMessage(
      "bot",
      "Ocorreu um erro ao falar com o servidor. Tente novamente em alguns instantes."
    );
  }
});

checkHealth();
