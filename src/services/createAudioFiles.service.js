import axios from "axios"
import fs from "fs"
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Function to generate audio files from podcast draft for Speaker A and Speaker B using two different Kokoro voice.

/*
PodcastDraft is an array of objects: [ {speaker:'A' , text:"bla bla bla"} , {speaker:'B' , text:"bla bla bla"}]
*/
const createAudioFiles = async (podcastDraft) => {
  // unique tmp folder for each user request
  // process.cwd() returns the current path of the directory from which the nodejs process was started
  const tempDir = path.join(process.cwd(), "public", uuidv4())
  fs.mkdirSync(tempDir , {recursive:true})

  const audios = await Promise.all(podcastDraft.map(async (speech, index) => {
    const response = await axios.post("http://localhost:8880/v1/audio/speech", {
      "model": "kokoro",
      "input": speech.text,
      "voice": speech.speaker == 'A' ? "af_alloy" : "af_bella",
      "response_format": "mp3",
      "download_format": "mp3",
      "speed": 1,
      "stream": true,
      "return_download_link": true,
      "lang_code": "b",
    }, {
      responseType: "arraybuffer"
    })
    
    const fileName = `speech_${speech.speaker}_${index}.mp3`
    const filePath = path.join(tempDir , fileName)
    fs.writeFileSync(filePath, Buffer.from(response.data))
    return filePath
  }))

  return {audios , tempDir}
}

export default createAudioFiles