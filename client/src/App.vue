<template>
  <div id="app" class="font-sans text-black text-center min-h-screen bg-grey-darkest flex justify-center  bg-grey-darkest">
    <div class="flex flex-col mx-auto items-center mt-32">
      <input autofocus v-model="searchInput" @keyup.enter="getVideos" class="rounded bg-grey text-white w-64 p-4 text-2xl" />
      <button @click="getVideos" class="rounded border-4 border-orange p-4 text-white text-xl my-4 hover:bg-orange"> Get videos </button>
      <h2 v-if="isDownloading" class="text-white">DOWNLOADING!!</h2>
      <div>
        <ul class="list-reset grid-container">
          <song-card @add="addToDownloads" v-for="song in fetchedVideos" :key="song.title" :song="song" :disableButton="getIndex(song) >= 0"></song-card>
        </ul>
      </div>
    </div>
    <download-list :toDownload="toDownload" :isDownloading="isDownloading" @remove="removeSong" @start-download="isDownloading = true" @got-urls="createLinks"></download-list>
  </div>
</template>

<script>
import SongCard from "./components/SongCard"
import DownloadList from "./components/DownloadList"

export default {
  name: "app",
  components: {
    SongCard,
    DownloadList
  },
  data() {
    return {
      searchInput: "",
      toDownload: [],
      fetchedVideos: [],
      isDownloading: false
    }
  },
  mounted() {},
  methods: {
    getVideos() {
      const API_KEY = process.env.VUE_APP_YOUTUBE_API_KEY
      console.log("process.env", process.env)
      fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&q=${
          this.searchInput
        }&type=video&key=${API_KEY}`
      )
        .then(res => res.json())
        .then(json => {
          let items = json.items
          console.log("items", items)
          let newarr = items.map(item => {
            let snippet = item.snippet
            return {
              url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              title: snippet.title,
              thumbnail: snippet.thumbnails.medium.url,
              published: snippet.publishedAt
            }
          })
          this.fetchedVideos = newarr
        })
    },
    addToDownloads(song) {
      // push to array for download
      let index = this.getIndex(song)
      if (index < 0) {
        this.toDownload.push(song)
      }
    },
    getIndex(song) {
      return this.toDownload.findIndex(element => element.title === song.title)
    },
    removeSong(song) {
      let index = this.getIndex(song)
      this.toDownload.splice(index, 1)
    },
    createLinks(directUrls) {
      console.log("direct urls", directUrls)
      directUrls.forEach(url => {
        let element = document.createElement("a")
        element.setAttribute("href", `${url}`)
        element.setAttribute("target", "_blank") //Needs to be here, or only one song will prompt for download
        console.log("element", element)
        element.style.display = "none"
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      })
      this.finishedDownload()
    },
    finishedDownload() {
      this.isDownloading = false
      this.toDownload = []
    }
  }
}
</script>

<style>
@import "../main.css";
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30px;
}
</style>
