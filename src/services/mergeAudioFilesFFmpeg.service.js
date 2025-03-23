import ffmpeg from "fluent-ffmpeg"
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import path from "path";
import ffprobe from '@ffprobe-installer/ffprobe';

ffmpeg.setFfprobePath(ffprobe.path)
ffmpeg.setFfmpegPath(ffmpegInstaller.path)

// Function to merge the audio files using FFmpeg
// FFmpeg works at the operating system level, not just in js
// FFmpeg reads the files from disk and merges them.
// audiofile is an array of filenames/paths of the audio files. So ,ffmpeg expects file paths and reads the audio files from disk when executing.
const mergeAudioFilesUsingFfmpeg = (audioFiles, tempDir) => {
  return new Promise((resolve, reject) => {
    const outputFile = path.join(tempDir, "final_podcast.mp3");

    const ffmpegCommand = ffmpeg()

    audioFiles.forEach((file) => ffmpegCommand.input(file))

    ffmpegCommand
      .on('end', () => {
        console.log('Merging complete!')
        resolve(outputFile);
      })
      .on('error', (err) => {
        console.error('Error merging files:', err)
        reject(err)
      })
      .mergeToFile(outputFile, tempDir)
  })
}

export default mergeAudioFilesUsingFfmpeg