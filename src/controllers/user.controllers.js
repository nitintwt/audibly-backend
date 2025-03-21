import axios from "axios"
import createPodcastDraft from "../services/ai.service.js"
import fs from "fs"
import { exec } from "child_process"
import ffmpeg from "fluent-ffmpeg"
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import path from "path"

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const createPodcast = async(req , res)=>{
  console.log("triggered")
  const {text} = req.body
  try {
    const podcastDraft = await createPodcastDraft(text)

    const arrayDraft = JSON.parse(podcastDraft)
    const audios= arrayDraft.map(async (speech, index)=>{
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
      fs.writeFileSync(fileName, Buffer.from(response.data));
      return fileName
    })
    const audioFiles = await Promise.all(audios)

    // Generate file list for FFmpeg
    const fileListPath = generateFileList(audioFiles);

    // Merge audio files
    const mergedAudioFile = "final_podcast.mp3";
    await mergeAudioFiles(fileListPath, mergedAudioFile);
    console.log("saved")
    return res.status(200).json({ message: "Podcast created"});
  } catch (error) {
    console.log("Something went wrong while creating audio" , error)
  }
}

// helper functions

// Function to generate the FFmpeg file list
const generateFileList = (audioFiles) => {
  const filePath = "audio_list.txt";
  const fileContent = audioFiles.map((file) => `file '${file}'`).join("\n");
  fs.writeFileSync(filePath, fileContent);
  return filePath;
};

// Function to merge the audio files using FFmpeg
const mergeAudioFiles = (audioFiles, outputFile) => {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg();

    audioFiles.forEach((file) => ffmpegCommand.input(file));

    ffmpegCommand
      .on('end', () => {
        console.log('Merging complete!');
        resolve(outputFile);
      })
      .on('error', (err) => {
        console.error('Error merging files:', err);
        reject(err);
      })
      .mergeToFile(outputFile, path.dirname(outputFile));
  });
};


export {createPodcast}