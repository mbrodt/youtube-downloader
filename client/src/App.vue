<template>
  <div id="app" class="font-sans text-black text-center min-h-screen bg-grey-darkest flex justify-center  bg-grey-darkest">
    <div class="flex flex-col mx-auto items-center mt-32">
      <!-- <a href='https://r2---sn-bavc5ajvooxju-j2ie.googlevideo.com/videoplayback?expire=1538531434&source=youtube&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpcm2cms%2Cpl%2Crequiressl%2Csource%2Cexpire&mime=audio%2Fwebm&key=yt6&dur=157.240&lmt=1538023087777361&keepalive=yes&itag=171&requiressl=yes&pcm2cms=yes&ipbits=0&ei=CcyzW_-pNI-F8gOFyanAAw&pl=23&ms=au%2Crdu&mt=1538509712&fvip=5&mv=m&txp=5511222&ip=212.237.134.75&signature=A9DC24177C1BCF2BEA3BB63D3B6325F9F900AB98.82A659207DED236FA41A7DAD8CDB7F1CACC6E54E&mm=31%2C29&initcwndbps=1821250&c=WEB&id=o-ANqQGtR80jhBemY3bJmf9KTqEbkFAHlUxODs9E7Podsn&gir=yes&clen=2695679&mn=sn-bavc5ajvooxju-j2ie%2Csn-i5h7lner&ratebypass=yes' download target="_blank" type="application/octet-stream">Click to download!</a>  -->
      <input autofocus v-model="searchInput" @keyup.enter="getVideos" class="rounded bg-grey w-64 p-4 text-2xl" />
      <button @click="getVideos" class="rounded border-4 border-orange p-4 text-white text-xl my-4 hover:bg-orange"> Get videos </button>
      <div>
        <ul class="list-reset grid-container">
          <song-card @add="addToDownloads" v-for="song in fetchedVideos" :key="song.title" :song="song"></song-card>
        </ul>
      </div>
    </div>
    <download-list :toDownload="toDownload" @remove="removeSong"></download-list>
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
      fetchedVideos: []
    }
  },
  mounted() {},
  methods: {
    getVideos() {
      const API_KEY = process.env.VUE_APP_YOUTUBE_API_KEY
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
            let url = `https://www.youtube.com/watch?v=${item.id.videoId}`
            let snippet = item.snippet
            let title = snippet.title
            let thumbnail = snippet.thumbnails.medium.url
            let published = snippet.publishedAt
            return {
              url,
              title,
              thumbnail,
              published
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
      // console.log("adding to dl")
      // let element = document.createElement("a")
      // element.setAttribute(
      //   "href",
      //   "data:application/octet-stream," +
      //     encodeURIComponent(
      //       `https://r2---sn-bavc5ajvooxju-j2ie.googlevideo.com/videoplayback?expire=1538531434&source=youtube&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpcm2cms%2Cpl%2Crequiressl%2Csource%2Cexpire&mime=audio%2Fwebm&key=yt6&dur=157.240&lmt=1538023087777361&keepalive=yes&itag=171&requiressl=yes&pcm2cms=yes&ipbits=0&ei=CcyzW_-pNI-F8gOFyanAAw&pl=23&ms=au%2Crdu&mt=1538509712&fvip=5&mv=m&txp=5511222&ip=212.237.134.75&signature=A9DC24177C1BCF2BEA3BB63D3B6325F9F900AB98.82A659207DED236FA41A7DAD8CDB7F1CACC6E54E&mm=31%2C29&initcwndbps=1821250&c=WEB&id=o-ANqQGtR80jhBemY3bJmf9KTqEbkFAHlUxODs9E7Podsn&gir=yes&clen=2695679&mn=sn-bavc5ajvooxju-j2ie%2Csn-i5h7lner&ratebypass=yes`
      //     )
      // )
      // element.setAttribute("download", true)
      // element.style.display = "none"
      // document.body.appendChild(element)
      // element.click()
      // document.body.removeChild(element)
    },
    getIndex(song) {
      return this.toDownload.findIndex(element => element.title === song.title)
    },
    removeSong(song) {
      let index = this.getIndex(song)
      this.toDownload.splice(index, 1)
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
