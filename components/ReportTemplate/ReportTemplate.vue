<template>
   <div class="page-container">
    <div v-for="(dataIndexList, pageIndex) in splitedDataIndex" :key="pageIndex" :class="['page', isSafari ? 'safari' : '']">
        <slot class="header" name="header" :pageNumber="pageIndex + 1"/>
        <div :ref="'page-body_' + pageIndex" class="page-body">
            <div v-for="(item,index) in dataIndexList" :key="index" :ref="'item_' + index">
                <slot name="body" :row="data[item]"/>
            </div>
        </div>
        <slot class="footer" name="footer" :pageNumber="pageIndex + 1 + ' of ' + totalPage"/>
    </div>
    <div v-if="!isHidden">
        <div :class="['page', isSafari ? 'safari' : '']">
            <slot class="header" name="header"/>
            <div ref="page-body_original" class="page-body">
                <div v-for="(item,index) in data" :key="index" :ref="'item_' + index">
                    <slot name="body" :row="item"/>
                </div>
            </div>
            <slot class="footer" name="footer"/>
        </div>
    </div>
</div>
</template>
<script lang="js">
import Vue from "vue";
export default{
    props: {
        data: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        }
    },
    created() {
        this.isSafari = !navigator.userAgent.includes("Chrome")
    },
    async mounted(){
        this.$nextTick(()=>{
            setTimeout(()=>{
                this.getElementHeightList()
                this.getPageSize()
                this.calculateElement()
            }, 100);
        })
    },
    methods: {
        getPageSize(){
            this.pageHeight = this.$refs["page-body_original"].getBoundingClientRect().height
        },
        getElementHeightList(){
            this.elementHeightList = this.data.map((f,index) => {
                // return this.$refs["item_" + index][0].getBoundingClientRect().height 
                return {
                    height: this.$refs["item_" + index][0].getBoundingClientRect().height,
                    data: f
                }
            })
        },
        calculateElement(){
            var currentContainerSize = 0
            this.splitedDataIndex.push([])
            this.elementHeightList.forEach((f,index) => {
                if(currentContainerSize + f.height  < this.pageHeight){
                    currentContainerSize += f.height
                    this.splitedDataIndex[this.splitedDataIndex.length - 1].push(index)
                    if(f.data.hasOwnProperty("inner")){
                        if(f.data.inner.skipPage == true && index != this.elementHeightList.length -1){
                            this.totalPage += 1
                            currentContainerSize = 0
                            this.splitedDataIndex.push([])
                        }        
                    }
                }else{
                    this.totalPage += 1
                    currentContainerSize = f.height
                    this.splitedDataIndex.push([index])
                }
            })
            this.isHidden = true
        }
    },
    data(){
        return {
            elementHeightList: [],
            splitedDataIndex: [],
            pageHeight: null,
            isHidden: false,
            totalPage: 1,
            isSafari: false,
        }
    }
}
</script>
<style lang="sass" scoped>
    .page-container
        width: 100%
        background: #e0e0e0
    body 
        width: 100%
        height: 80%
        margin: 0mm !important
        padding: 0mm !important
    * 
        box-sizing: border-box
        -moz-box-sizing: border-box
        margin: 0mm !important
    .page 
        // width: 210mm
        // height: 296mm !important
        width: 297mm !important
        height: 209mm
        padding: 12pt
        background: white
        display: flex
        flex-direction: column
        flex-flow: column
        page-break-after: always
        page-break-inside: avoid
        page-break-before: avoid
    .safari
        height: 195mm !important
    .page-body 
        flex-grow: 1
        overflow: hidden
    .header
        flex-grow: 0
    .footer
        flex-grow: 0
    @media print 
        @page 
            size: A4 landscape !important
            margin: 0mm !important
            // size: A4 portrait !important
            // margin: 0mm !important
        body
            margin: 0px
            height: 100%
        .page
            page-break-after: always
            page-break-inside: avoid
            page-break-before: avoid
</style>