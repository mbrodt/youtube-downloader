const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const ytdl = require("ytdl-core")
const youtubedl = require("youtube-dl")
const path = require("path")
const cors = require("cors")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({ credentials: true, origin: true }))

app.get("/", (req, res) => res.send("Hey there"))
app.post("/download", (req, res) => {
  let songs = req.body
  console.log("songs", songs)
  //for some reason runs twice with the same song???
  songs.forEach(song => getAudio(song))
})

function getAudio(song) {
  //currently gets .webm format (because that is 'bestaudio')
  //TODO: figure out how to get mp3
  const video = youtubedl(song.url, ["-f", "bestaudio"], {
    cwd: __dirname
  })
  video.on("info", function(info) {
    console.log("Download started")
    console.log("tags", info.tags)
    console.log("duration", info.duration)
    console.log("filename", info._filename)
    console.log("size", info.size)
    console.log("ext", info.ext)
    let title = info._filename
    let ext = info.ext
    const output = path.join(__dirname + "/downloads", title)
    video.pipe(fs.createWriteStream(output))
  })
  video.on("end", function end() {
    "use strict"
    console.log("video", video)
    console.log("\nDone")
  })
}

app.listen(3000, () => {
  console.log("Listening on port 3000")
})
