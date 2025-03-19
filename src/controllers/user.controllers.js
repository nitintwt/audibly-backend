import axios from "axios"
import createPodcastDraft from "../services/ai.service.js"
import fs from "fs"

const createPodcast = async(req , res)=>{
  console.log("triggered")
  const {text} = req.body
  //const podcastDraft = await createPodcastDraft(text)
  //console.log("draft",podcastDraft)
  const speech = await axios.post("http://localhost:8880/v1/audio/speech", {
    "model": "kokoro",
    "input": "HELLO NITIN SINGH. I am here to help you",
    "voice": "af_alloy",
    "response_format": "mp3",
    "download_format": "mp3",
    "speed": 1,
    "stream": true,
    "return_download_link": true,
    "lang_code": "b",
  }, {
    responseType: "arraybuffer"  // Forces binary response
  })
  fs.writeFileSync("speech.mp3", Buffer.from(speech.data));
  console.log("MP3 file saved!");
  return res.status(200).json({message:"Got the text"})
}

export {createPodcast}