import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function getChatResponse(
  userMessage: string,
  chatHistory: { role: "user" | "assistant"; content: string }[],
  systemPrompt: string,
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Enhance the system prompt to request structured responses
    const enhancedPrompt = `${systemPrompt}

When recommending products, please use the following JSON structure within your response (all fields are required except imageUrl):
[PRODUCT_REC]{"id": "product-id", "name": "Product Name", "price": price, "type": "Sacred Geometry" | "Flower Essence", "description": "Product description", "stock": 999, "imageUrl": "/products/product-image.jpg"}[/PRODUCT_REC]

For example:
I recommend the Dodecahedron for spiritual growth [PRODUCT_REC]{"id": "dodecahedron", "name": "Dodecahedron (Aether Element)", "price": 19.99, "type": "Sacred Geometry", "description": "The Dodecahedron represents the aether element and spiritual growth", "stock": 999, "imageUrl": "/products/sacred-geometry.svg#dodecahedron"}[/PRODUCT_REC]
Or for flower essences:
I recommend Olive Essence for exhaustion [PRODUCT_REC]{"id": "olive", "name": "Olive Essence", "price": 19.99, "type": "Flower Essence", "description": "For mental and physical exhaustion", "stock": 999, "imageUrl": "/products/flower-essence.svg"}[/PRODUCT_REC]`;

    // Start a new chat
    const chat = model.startChat();

    // Send the enhanced system prompt first
    await chat.sendMessage(enhancedPrompt);

    // Send the chat history
    for (const msg of chatHistory) {
      await chat.sendMessage(msg.content);
    }

    // Send the user's message and get the response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "I apologize, but I'm having trouble processing your request at the moment. Please try again later.";
  }
}
