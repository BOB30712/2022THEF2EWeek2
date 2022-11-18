<template>
    <div class="d-flex justify-content-center">
        <canvas id="canvas" style="border: 1px solid #000"> </canvas>
    </div>
    <div class="d-flex justify-content-between mt-3">
        <div>
            <p class="fs-3">點擊加入簽名檔</p>
            <img class="sign" style="border: 1px solid #000" width="250" height="150" />
        </div>
        <button class="btn btn-danger fs-3" @click="this.$router.push('/')">更換選擇檔案</button>
        <div class="d-flex align-items-center">
            <button id="forward" class="btn btn-primary m-5" :disabled="currentPage==1">上一頁</button>
            <p class="fs-3 mb-0">當前頁數:{{currentPage}}/</p>
            <p class="fs-3 mb-0">總頁數:{{maxPage}}</p>
            <button id="next" class="btn btn-primary m-5" :disabled="currentPage==maxPage">下一頁</button>
        </div>
        <button class="btn btn-danger fs-3" @click="this.$router.push('/DrawView')">重新繪製簽名檔</button>
        <button class="download btn btn-success fs-3">download PDF</button>
    </div>
</template>

<style  lang="scss">
@import "../assets/all.scss";
img{
    cursor: pointer;
}
</style>

<script>
/* eslint-disable */
import { fabric } from 'fabric'
export default {
    data () {
        return {
            maxPage: 0,
            currentPage:1
        }
    },
    methods: {
        async loadFile(canvas) {
            canvas.requestRenderAll();
            const pdfData = await this.printPDF(1);
            //this.testData = e.target.files[0]
            //this.filesize = (e.target.files[0].size/1048576).toFixed(2)
            //console.log(e.target.files[0])
            //this.page=1
            const pdfImage = await this.pdfToImage(pdfData);
            // 調整canvas大小
            canvas.setWidth(pdfImage.width / window.devicePixelRatio);
            canvas.setHeight(pdfImage.height / window.devicePixelRatio);
            canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
        },
        readBlob (blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.addEventListener("load", () => resolve(reader.result));
                reader.addEventListener("error", reject);
                reader.readAsDataURL(blob);
            });
        },
        async printPDF (page) {
            const data = localStorage.getItem("filedata");
            // Using DocumentInitParameters object to load binary data.
            const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
            const pdfPage = await pdfDoc.getPage(page);
            this.maxPage = pdfDoc._pdfInfo.numPages 
            const viewport = pdfPage.getViewport({ scale: 2 });
            // const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            // 控制顯示PDF的寬高
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            const renderContext = {
                canvasContext: context,
                viewport,
            };
            const renderTask = pdfPage.render(renderContext);

            // 回傳做好的canvas
            return renderTask.promise.then(() => canvas);
        },
        async  pdfToImage(pdfData) {
        const scale = 1 / window.devicePixelRatio;
        return new fabric.Image(pdfData, {
            scaleX: scale,
            scaleY: scale,
        });
        }
    },
    mounted () {
        let canvas = new fabric.Canvas("canvas");
        this.loadFile(canvas);

        document.querySelector("#next").addEventListener("click", async (e) => {
            e.preventDefault();
            canvas.requestRenderAll();
            if(this.currentPage!=this.maxPage){
                this.currentPage=this.currentPage+1;
            }
            const pdfData = await this.printPDF(this.currentPage);
            const pdfImage = await this.pdfToImage(pdfData);
            // 調整canvas大小
            canvas.setWidth(pdfImage.width / window.devicePixelRatio);
            canvas.setHeight(pdfImage.height / window.devicePixelRatio);
            canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
        });

        document.querySelector("#forward").addEventListener("click", async (e) => {
            e.preventDefault();
            canvas.requestRenderAll();
            if(this.currentPage!=1){
                this.currentPage=this.currentPage-1;
            }
            const pdfData = await this.printPDF(this.currentPage);
            const pdfImage = await this.pdfToImage(pdfData);
            // 調整canvas大小
            canvas.setWidth(pdfImage.width / window.devicePixelRatio);
            canvas.setHeight(pdfImage.height / window.devicePixelRatio);
            canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
        });

        // 加入簽名
        const sign = document.querySelector(".sign");
        if (localStorage.getItem("img")) {
            sign.src = localStorage.getItem("img");
            this.testImg =  localStorage.getItem("img");
        }
        sign.addEventListener("click", () => {
            if (!sign.src) return;
            fabric.Image.fromURL(sign.src, function (image) {
                image.top = 400;
                image.scaleX = 0.5;
                image.scaleY = 0.5;
                canvas.add(image);
            });
        });
        // 下讚PDF
        const pdf = new jsPDF();
        const download = document.querySelector(".download");
        download.addEventListener("click", () => {
            const image = canvas.toDataURL("image/png");
            const width = pdf.internal.pageSize.width;
            const height = pdf.internal.pageSize.height;
            pdf.addImage(image, "png", 0, 0, width, height);
            pdf.save("download.pdf");
        });
    }
}
</script>
