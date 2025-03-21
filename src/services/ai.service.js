import { InferenceClient } from "@huggingface/inference";

const createPodcastDraft = async (text)=>{
  const client = new InferenceClient(process.env.HUGGING_API_KEY)
  const prompt = `
   Convert the following text into a podcast-style conversation between two intellectual speakers. 
   Speaker A is male and Speaker B is female. Each speaker should provide thoughtful insights about the topic.
  
  Output Format should only be one array , and that array will be array of ojects and no nested arrays , and no other text. For example:
  [
    {"speaker": "A", "text": "Hey, did you hear about the new AI tool?"},
    {"speaker": "B", "text": "Yeah! It’s really impressive. How does it work?"},
    {"speaker": "A", "text": "Well, it uses deep learning to generate human-like conversations."},
    {"speaker": "B", "text": "That sounds amazing! Can you give me an example?"},
  ]
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