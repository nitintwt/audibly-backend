import createPodcastDraft from "../services/createPodcastDraft.service.js"
import createAudioFiles from "../services/createAudioFiles.service.js"
import mergeAudioFilesUsingFfmpeg from "../services/mergeAudioFilesFFmpeg.service.js"
import fs from 'fs'
import path from 'path'

const createPodcast = async(req , res)=>{
  console.log("triggered")
  let {text} = req.body
  // there is a limit of number of tokens for groq api , that's why I am slicing the input text into length of 20000(5000 tokens approx) 
  if(text.length > 20000){
    text = text.slice(0 , 20000)
  }
  try {
    // create podcast draft for speaker A and Speaker B
    const podcastDraft = await createPodcastDraft(text)
    console.log("Draft", podcastDraft)

    // Generate Audio files for Speaker A and Speaker B using two different kokoro voices
    const {audios , tempDir} = await createAudioFiles(podcastDraft)
    console.log("audios" , audios)

    // Merge audio files
    await mergeAudioFilesUsingFfmpeg(audios, tempDir);
    console.log("saved")

    res.sendFile(path.join(tempDir, "final_podcast.mp3"), (err) => {
      if (err) {
        console.error("Error sending file:", err)
      } else {
        setTimeout(() => {
          try {
            fs.rmSync(tempDir, { recursive: true, force: true })
            console.log("Temporary files deleted.")
          } catch (deleteErr) {
            console.error("Error deleting temp folder:", deleteErr)
          }
        }, 5000)
      }
    })
  } catch (error) {
    console.log("Something went wrong while creating audio" , error)
    return res.status(500).json({message:"Something went wrong while creating your podcast.Try again"})
  }
}

export {createPodcast}