const express = require("express")
const bodyParser = require("body-parser")
const fs = require("fs")
const youtubedl = require("youtube-dl")
const path = require("path")
const cors = require("cors")
const { promisify } = require("util")

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({ credentials: true, origin: true }))

app.get("/", (req, res) => res.send("Hey there"))
app.post("/download", async (req, res) => {
  let songs = req.body
  let urls = await asyncMap(songs)
  console.log("urls", urls)
  res.send(urls)
})

async function asyncMap(songs) {
  const pArray = songs.map(async song => {
    const directUrl = await getDirectUrl(song)
    return directUrl
  })
  const urlArray = await Promise.all(pArray)
  return urlArray
}

async function getDirectUrl(song) {
  const getInfoAsync = promisify(youtubedl.getInfo)
  try {
    const info = await getInfoAsync(song.url, ["-f", "bestaudio"])
    return info.url
  } catch (err) {
    console.log("something went wrong in getting url")
  }
}

function downloadToDisk(song) {
  //currently gets .webm format (because that is 'bestaudio')
  //TODO: figure out how to get mp3
  const video = youtubedl(song.url, ["-f", "bestaudio"], {
    cwd: __dirname
  })
  video.on("info", function(info) {
    console.log("Download started")
    let title = info._filename
    const output = path.join(__dirname + "/downloads", title)
    video.pipe(fs.createWriteStream(output))
  })
  video.on("end", function end() {
    "use strict"
    console.log("\nDone downloading")
  })
}

app.listen(3000, () => {
  console.log("Listening on port 3000")
})
