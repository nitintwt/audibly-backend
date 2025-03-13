import createPodcastDraft from "../services/ai.service.js"

const createPodcast = async(req , res)=>{
  console.log("triggered")
  const {text} = req.body
  const podcastDraft = await createPodcastDraft(text)
  console.log("draft",podcastDraft)
  return res.status(200).json({message:"Got the text"})
}

export {createPodcast}