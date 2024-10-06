import OpenAI from "openai";
import dotenv from "dotenv";
import { getMediaByUserId } from "./mediaController.js";


dotenv.config();


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  
  
  let systemPrompt = `You are an AI that recommends books, TV shows, or films based on a user's previous media items. Your style is friendly, informal, and familiar. Your target audience is young adults.
  1. Thought: Consider the user's previous media items and think about what they might like.
  2. Action: Recommend a book, TV show, or film that you think the user might like.
  3. Observation: Observe the user's reaction to your recommendation.
  `;
  
  export async function agent(userId, query) {
    // Fetch user's media history from your database
    const mediaItems = await getMediaByUserId(userId);
  
    let messagesArray = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `I liked ${mediaItems.join(", ")}. ${query}`,
      },
    ];
  
    let userFeedback = "";
    const MAX_ITERATIONS = 6;
  
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messagesArray,
      });
      console.log(messagesArray)
      const aiResponse = response.choices[0].message.content;
  
  
      messagesArray.push({
        role: "assistant",
        content: aiResponse,
      });
  
      if (i === 0) {
        userFeedback = "Can you explain why this show relates to my preferences? Please provide more specific connections to titles I've liked.";
      } else if (i === 1) {
        userFeedback = `I liked that, but can you suggest something less mainstream? I'd love something with a cult following.`;
      } else if (i === 2) {
        userFeedback = `Can you refine the recommendation to focus on books or shows with more character development?`;
      } else {
        userFeedback = `Now, can you summarise all of your recommendations from the messagesArray into one succinct paragraph, explain why they are recommended for this user based on the media items linked to their account? This is the only version the user will see, so make sure it covers all the points. Remember your tone is informal, friendly and casual as your audience is young adults.`;
      }
  
      messagesArray.push({
        role: "user",
        content: userFeedback,
      });
  
      if (userFeedback.includes("perfect")) {
        break;
      }
    }
  
    return messagesArray[messagesArray.length - 2].content;
  }