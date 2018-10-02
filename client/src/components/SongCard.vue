<template>
    <div class="w-96 mx-auto bg-white rounded shadow-lg flex">
        <img class="w-1/2" :src="song.thumbnail" alt="">
        <div class="w-1/2 flex flex-col justify-between">
            <a :href="song.url" target="_blank" class="text-xl font-semibold m-4 text-left text-black no-underline">{{song.title}} </a>
            <!-- <p class="text-sm text-left">({{song.published}})</p> -->
            <!-- <a :href="song.url">View on Youtube</a> -->
            <ul class="list-reset flex justify-around">
                <li class="inline-block bg-grey-lighter rounded-full px-6 py-2 text-sm font-semibold text-grey-darker" v-for="tag in song.tags" :key="tag">{{tag}}</li>
            </ul>
            <button @click="addToDownloads" class="bg-orange rounded text-white m-4 h-12">Add to Downloads</button>
        </div>
    </div>
</template>

<script>
export default {
  props: ["song"],
  methods: {
    addToDownloads() {
      console.log("clicked")
      this.$emit("add", this.song)
    }
  }
}
</script>

<style scoped>
</style>