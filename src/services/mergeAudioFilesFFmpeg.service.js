import ffmpeg from "fluent-ffmpeg"
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import path from "path";
import ffprobe from '@ffprobe-installer/ffprobe';

ffmpeg.setFfprobePath(ffprobe.path)
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
// Function to merge the audio files using FFmpeg
const mergeAudioFilesUsingFfmpeg = (audioFiles, outputFile) => {
  return new Promise((resolve, reject) => {
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
      .mergeToFile(outputFile, path.dirname(outputFile))
  })
}

export default mergeAudioFilesUsingFfmpeg