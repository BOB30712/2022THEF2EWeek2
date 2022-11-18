<template>
    <div class="d-flex flex-column justify-content-between py-5 bg-gray" style="height:100vh;">
        <div class="d-flex justify-content-around">
            <div>
                <p class="fs-2 fw-bold mb-5">繪製簽名圖</p>
                <canvas class="d-block bg-light" ref="sketchpad" id="canvans" width="500" height="300" style="border: 1px solid black;"
                @mousedown="startPosition"
                @mouseup="finishedPosition"
                @mouseleave="finishedPosition"
                @mousemove="draw"></canvas>
            </div>
            <div>
                <p class="fs-2 fw-bold mb-5">當前簽名檔</p>
                <img class="d-block border border-1 border-dark bg-light" id="show-img" width="500" height="300">
            </div>
        </div>
        <div class="d-flex justify-content-around mt-auto">
            <button type="button" class="btn btn-danger p-5 fs-3 fw-bold" @click="this.$router.push('/')">重新選擇檔案</button>
            <button type="button" class="btn btn-danger p-5 fs-3 fw-bold" @click.prevent="clearcanvas">清除內容</button>
            <button type="button" class="btn btn-success p-5 fs-3 fw-bold" @click="saveImage">儲存</button>
            <button type="button" class="btn btn-primary p-5 fs-3 fw-bold" @click="this.$router.push('/PdfView2')">下一步</button>
        </div>
    </div>
</template>

<style lang="scss">
@import "../assets/all.scss";
.bg-gray{
    background-color: #EEEDE8;
}
</style>

<script>
/* eslint-disable */
export default {
data () {
    return {
    isPainting: false,
    canvas: {},
    ctx: {},
    showImage: {}
    }
},
methods: {
    clearcanvas(){
        this.ctx.clearRect(0, 0, 500, 300); 
    },
    getPaintPosition (e) {
        const canvasSize = this.canvas.getBoundingClientRect()
        if (e.type === 'mousemove') {
            return {
            x: e.clientX - canvasSize.left,
            y: e.clientY - canvasSize.top
            }
        } else {
            return {
            x: e.touches[0].clientX - canvasSize.left,
            y: e.touches[0].clientY - canvasSize.top
            }
        }
    },
    startPosition (e) {
        e.preventDefault()
        this.isPainting = true
        },
        finishedPosition () {
        this.isPainting = false
        this.ctx.beginPath()
    },
    draw (e) {
        if (!this.isPainting) return
        const paintPosition = this.getPaintPosition(e)
        this.ctx.lineTo(paintPosition.x, paintPosition.y)
        this.ctx.stroke()
    },
    saveImage () {
        this.showImage = document.querySelector('#show-img')
        // 圖片儲存的類型選擇 png ，並將值放入 img 的 src
        const newImg = this.canvas.toDataURL('image/png')
        this.showImage.src = newImg
        localStorage.setItem('img', newImg)
        //this.$router.push('/PdfView2')
    }
},
mounted () {
    this.canvas = document.querySelector('#canvans')
    this.ctx = this.canvas.getContext('2d') // 要使用 2D 的方式繪圖
    this.ctx.lineWidth = 4
    this.ctx.lineCap = 'round'
}
}
</script>
  