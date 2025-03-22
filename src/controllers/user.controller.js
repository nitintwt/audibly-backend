import createPodcastDraft from "../services/createPodcastDraft.service.js"
import fs from "fs"
import createAudioFiles from "../services/createAudioFiles.service.js"
import mergeAudioFilesUsingFfmpeg from "../services/mergeAudioFilesFFmpeg.service.js"

const createPodcast = async(req , res)=>{
  console.log("triggered")
  const {text} = req.body
  try {
    // create podcast draft for speaker A and Speaker B
    const podcastDraft = await createPodcastDraft(text)
    console.log("Draft", podcastDraft)

    // Generate Audio files for Speaker A nd Speaker B using two different kokoro voices
    const audios = await createAudioFiles(podcastDraft)
    console.log("audios" , audios)

    // Merge audio files
    const mergedAudioFile = "final_podcast.mp3";
    await mergeAudioFilesUsingFfmpeg(audios, mergedAudioFile);
    console.log("saved")
    return res.status(200).json({ message: "Podcast created"});
  } catch (error) {
    console.log("Something went wrong while creating audio" , error)
    return res.status(500).json({message:"Something went wrong while creating your podcast.Try again"})
  }
}

// Function to generate the FFmpeg file list
const generateFileList = (audioFiles) => {
  const filePath = "audio_list.txt"
  
  fs.writeFileSync(filePath, fileContent)
  return filePath
}

export {createPodcast}