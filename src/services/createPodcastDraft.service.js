import { InferenceClient } from "@huggingface/inference";

const createPodcastDraft = async (text)=>{
  const client = new InferenceClient(process.env.HUGGING_API_KEY)
  const prompt = `
    Transform the following text into a podcast-style conversation between two experts. Speaker A is a knowledgeable male expert and Speaker B is a knowledgeable female expert. They should exchange thoughtful insights, ask clarifying questions, and offer balanced viewpoints on the topic. 

    **Output Requirements:**
    - Your output must be exactly one JSON array.
    - Each element of the array must be an object with exactly two keys: "speaker" and "text".
    - The "speaker" value must be either "A" or "B" only.
    - Do not include any additional text, commentary, or nested arrays outside of this JSON array.

    For example:
    [
      {"speaker": "A", "text": "Hey, have you seen the latest developments in AI?"},
      {"speaker": "B", "text": "Yes, it's fascinating how deep learning is evolving."},
      {"speaker": "A", "text": "Absolutely, it opens up many new possibilities."},
      {"speaker": "B", "text": "I agree. What do you think are the biggest challenges?"},
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
    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.log("Something went wrong while creating podcast draft" , error)
  }
}

export default createPodcastDraft