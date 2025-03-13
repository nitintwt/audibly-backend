import { InferenceClient } from "@huggingface/inference";

const createPodcastDraft = async (text)=>{
  const client = new InferenceClient(process.env.HUGGING_API_KEY)
  const prompt = `
   Convert the following text into a podcast-style conversation between two intellectual speakers. 
   Speaker A is male and Speaker B is female. Each speaker should provide thoughtful insights about the topic.
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
    return response.choices[0].message.content
  } catch (error) {
    console.log("Something went wrong while creating podcast draft" , error)
  }
}

export default createPodcastDraft