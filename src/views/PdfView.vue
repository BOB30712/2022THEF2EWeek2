<template>
    <div class="bg-grey d-flex flex-column justify-content-center align-items-center">
        <div id="dropFile" @dragover.prevent="test('dragover')" @dragleave.prevent="test('dragleave')" @drop.prevent="test('dragexit')" class="inputPdf d-flex flex-column justify-content-center">
            <p><span class="select">點擊此處上傳</span> 或 直接拖曳檔案</p>
            <p>(限10MB以下PDF檔)</p>
            <p>{{filename}}</p>
        </div>
        <div>
            <button class="btn btn-primary fs-2" @click="this.$router.push('/DrawView')">下一步</button>
        </div>
    </div>
</template>

<style lang="scss">
@import "../assets/all.scss";
.bg-grey{
    height: 100vh;
    background-color:#EEEDE8;
}
.inputPdf{
    background-color: #FFFFFF;
    border-radius: 35px;
    margin: 50px;
    border: 5px dashed #A5A39C;
    width: 70%;
    height: 700px;
}
.inputPdf:hover{
    background-color:#000000;
    color: #FFFFFF;
}
.inputPdf>p{
    font-size: 40px;
}
.select{
    cursor: pointer;
}
</style>

<script>
/* eslint-disable */
import { fabric } from 'fabric'
import { gsap } from "gsap"
export default {
  data () {
    return {
        file: {},
        filename: '',
        filesize:0,
    }
  },
  methods: {
    test(str){
        if(str=='dragover'){
            gsap.to('.inputPdf',{'background-color':'#000000'})
            gsap.to('.inputPdf',{'color':'#FFFFFF'})
        }else{
            gsap.to('.inputPdf',{'background-color':'#FFFFFF'})
            gsap.to('.inputPdf',{'color':'#000000'})
        }
    },
    readBlob (blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result));
        reader.addEventListener("error", reject);
        reader.readAsDataURL(blob);
      });
    },
    async printPDF (pdfData) {
        const Base64Prefix = "data:application/pdf;base64,";
        pdfData = await this.readBlob(pdfData);
        const data = atob(pdfData.substring(Base64Prefix.length));
        localStorage.setItem('filedata', data)
        //this.$router.push('/DrawView')
    }
  },
  mounted () {
    let canvas = new fabric.Canvas("canvas");
    document.querySelector('.select').addEventListener('click', async ( ) => {
        const arrFileHandle = await window.showOpenFilePicker({
            multiple: true
        })
        const files = []
        for (const fileHandle of arrFileHandle) {
            files.push(await fileHandle.getFile())
        }
        canvas.requestRenderAll();
        this.filesize = (files[0].size/1048576).toFixed(2)
        if(this.filesize>10){
            this.$router.push('/')
            localStorage.clear();
            alert("檔案超過10MB")
        }else{
            this.filename=files[0].name; 
        }
        await this.printPDF(files[0],1);
    });
    document.querySelector("#dropFile").addEventListener("drop", async (e) => {
        e.preventDefault();
        canvas.requestRenderAll();
        this.filesize = (e.dataTransfer.files[0].size/1048576).toFixed(2)
        if(this.filesize>10){
            this.$router.push('/')
            localStorage.clear();
            alert("檔案超過10MB")
        }else{
            this.filename=e.dataTransfer.files[0].name;
        }
        await this.printPDF(e.dataTransfer.files[0],1);
    });
  }
}
</script>
