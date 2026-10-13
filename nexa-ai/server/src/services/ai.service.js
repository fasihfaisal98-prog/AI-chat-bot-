
const OLLAMA_BASE_URL =
  process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";

const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2:1b";

const SYSTEM_PROMPT = `
You are Nexa AI, a helpful and intelligent AI assistant.
Give accurate, clear, and useful answers.
Use previous conversation messages to maintain context.
Format code and technical explanations clearly when appropriate.
If you do not know something, be honest about it.
`.trim();

async function callOllama(messages, options = {}) {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      options: {
        temperature: options.temperature ?? 0.7,
      },
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Ollama request failed (${response.status}): ${errorText}`
    );
  }

  const data = await response.json();
  const content = data.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Ollama returned an empty response.");
  }

  return content.trim();
}

/**
 * Generate an AI response using conversation history.
 */
async function generateAIResponse(conversationMessages = [], promptText) {
  if (typeof promptText !== "string" || !promptText.trim()) {
    throw new Error("A valid prompt is required.");
  }

  const history = Array.isArray(conversationMessages)
    ? conversationMessages
        .filter(
          (message) =>
            ["user", "assistant"].includes(message.role) &&
            typeof message.content === "string" &&
            message.content.trim()
        )
        .slice(-20)
        .map((message) => ({
          role: message.role,
          content: message.content,
        }))
    : [];

  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    ...history,
    {
      role: "user",
      content: promptText.trim(),
    },
  ];

  return callOllama(messages);
}

/**
 * Generate a short conversation title.
 */
async function generateConversationTitle(promptText) {
  try {
    const title = await callOllama(
      [
        {
          role: "system",
          content:
            "Create a concise title for a chat conversation. " +
            "Use 3 to 6 words. Return only the title, without quotes.",
        },
        {
          role: "user",
          content: `Create a title for this conversation:\n${promptText}`,
        },
      ],
      { temperature: 0.3 }
    );

    return title
      .replace(/^["'`]+|["'`]+$/g, "")
      .replace(/^title:\s*/i, "")
      .split("\n")[0]
      .slice(0, 80)
      .trim() || "New Chat";
  } catch (error) {
    console.error("Title generation failed:", error.message);

    // Chat should still work if title generation fails.
    return "New Chat";
  }
}

export default {
  generateAIResponse,
  generateConversationTitle,
};
