<template>
  <div>
    <div ref="containerRef" id="containerRef" style="
        display: flex;
        height: 100vh;
        width: 100vw;
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
import PdfBook from "../../chinese-book.pdf";
import { onMounted, ref } from "vue";

const onceRenderNum = 6;
let pdf = null;
const containerRef = ref(null);
const totalPageNum = ref(0)
const renderPageNum = ref(onceRenderNum) //当前渲染的页数

async function initLibs() {
  let PDFJS = await import("pdfjs-dist");
  window.pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.js");

  PDFJS.GlobalWorkerOptions.workerSrc = window.pdfjsWorker;

  const loadingTask = PDFJS.getDocument(PdfBook);
  pdf = await loadingTask.promise;
  totalPageNum.value = pdf.numPages
  await renderPages(onceRenderNum)
}

const renderPages = async (nums) => {
  const container = document.querySelector('#containerRef')

  for (let index = 1; index < nums; index++) {
    const { canvas } = await renderPage(index)
    container.appendChild(canvas)
  }
}

function prevPage() {
  $("#containerRef").turn("previous")
}

function nextPage() {
  dynamicAddPages($("#containerRef").turn('view')[1])
  $("#containerRef").turn("next")
}
const dynamicAddPages = async (currentPage) => {

  if (renderPageNum.value - (currentPage + 1) === 0) {
    renderPageNum.value += onceRenderNum
    for (let index = currentPage + 1; index <= renderPageNum.value; index++) {
      const { dom } = await renderPage(index)
      $('#containerRef').turn('addPage', dom, index)
    }
  }
}
const renderPage = async (page) => {
  const containerWidth = containerRef.value.offsetWidth;
  const containerHeight = containerRef.value.offsetHeight;
  const outputScale = window.devicePixelRatio || 1;
  const transform =
    outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
  const currentPage = await pdf.getPage(page);
  const currentPageViewport = currentPage.getViewport({ scale: 1 });
  const pdfWidth = currentPageViewport.width;
  const pdfHeight = currentPageViewport.height;
  const newScale = Math.min(
    containerWidth / pdfWidth,
    containerHeight / pdfHeight
  );
  const scaledViewport = currentPage.getViewport({ scale: newScale });

  const canvas = document.createElement('canvas');
  const canvasContext = canvas.getContext("2d");
  let width = Math.floor(pdfWidth * outputScale);
  let height = Math.floor(pdfHeight * outputScale);
  width = scaledViewport.width;
  height = scaledViewport.height;
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  await currentPage.render({
    canvasContext: canvasContext,
    transform,
    viewport: scaledViewport,
  }).promise

  return {
    canvas,
    dom: `<img src=${canvas.toDataURL('image/png')}>`
  }
}

onMounted(async () => {
  await initLibs();
  $("#containerRef").turn({
    autoCenter: true,
    display: 'double',
    width:1440,
    height:946,
    page: 1,
    when: {
      turning: function (e, page, currentPage) {
         dynamicAddPages(currentPage[1])
      }
    }
  });
});
</script>

<style scoped></style>