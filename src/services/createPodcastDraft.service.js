import { InferenceClient } from "@huggingface/inference";

const createPodcastDraft = async (text)=>{
  const client = new InferenceClient(process.env.HUGGING_API_KEY)
  const prompt = `
  Hello there! I'd like you to help create a lively, engaging podcast conversation. Please take the provided text and transform it into a natural discussion between two experts who build on each other's ideas, rather than a simple question and answer session. Imagine the two experts are sitting together over coffee, discussing the topic with thoughtful insights and interjections.
  
  Here are the details:
  - Speaker A is a knowledgeable male expert.
  - Speaker B is a knowledgeable female expert.
  - They should share ideas, challenge and build on each other's points, and offer balanced perspectives, rather than just asking and answering questions.
  
  **Output Requirements:**
  - Your output must be **exactly one JSON array**.
  - The response **must start with "[" and end with "]"**.
  - Each element of the array must be an object with exactly two keys: "speaker" and "text".
  - The "speaker" value must be either "A" or "B" only.
  - Do not include any additional text, commentary, or nested arrays outside of this JSON array.
  
  For example, your output should look like this:
  [ 
  {"speaker": "A", "text": "I was really impressed by the recent advances in AI."}, 
  {"speaker": "B", "text": "Absolutely, the way deep learning is evolving opens up many possibilities."},
  ]

  ** The output should always be a valid json array with open and closed brackets, [] **
  `  
  try {
    const response = await client.chatCompletion({
      model:"meta-llama/Llama-3.2-3B-Instruct",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: text },
      ],
      provider: "hf-inference",
      max_tokens: 10000,
    })
    console.log("response" , response.choices[0].message.content)
    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.log("Something went wrong while creating podcast draft" , error)
    return error
  }
}

export default createPodcastDraft