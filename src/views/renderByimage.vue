<template>
  <div>
    <div ref="containerRef" id="containerRef" style="
        display: flex;
        height: 964px;
        width: 1440px;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      ">
    </div>

    <div style="
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      ">
      <button @click="prevPage">prev</button>
      <button @click="nextPage">next</button>
    </div>
  </div>
</template>

<script setup>
import '../assets/turn'
import $ from 'jquery';
import { onMounted, ref } from "vue";

const img = ref([])
const containerRef = ref(null);

function prevPage() {
  $("#containerRef").turn("previous")
}

function nextPage() {
  $("#containerRef").turn("next")
}

const fetchImg = () => {
  return new Promise((resolve) => {
    const container = document.querySelector('#containerRef')
    let width = 0
    let height = 0
    for (let i = 1; i < 119; i++) {
      const imgs = document.createElement('img')
      img.value.push(require(`@/assets/chinese-book-${i}.webp`))
      imgs.src = require(`@/assets/chinese-book-${i}.webp`)
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      width = containerWidth;
      height = containerHeight;
      container.appendChild(imgs)
    }
    resolve({ width, height })
  })
}
onMounted(async () => {
  const { width, height } = await fetchImg()
  $("#containerRef").turn({
    autoCenter: true,
    display: 'double',
    width,
    height,
    page: 1,
  });
});
</script>

<style scoped></style>