<template>
    <div class="block">
        <el-timeline :reverse="true">
            <el-timeline-item v-for="(logList, key, index) in logMap" :key="index" :timestamp="key" placement="top">
                <el-card :body-style="{'padding': '.8em'}">
                    <log-tile v-for="(log, index) in logList" :key="index" :name="log.updatedFromLabel" :fieldName="log.fieldLabel" :oldValue="log.oldValueLabel" :newValue="log.newValueLabel" :createdDate="log.createdDate" :withDivider="index != logList.length - 1"/>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script lang="js">
import Vue from "vue";
import {
    Request,
} from "vue_basecomponent";
export default Vue.extend({
    layout: "CMSLayout",
    mounted(){
        this.logList.filter(f => f.oldValueLabel != f.newValueLabel).forEach(f => {
            var createdDateKey = f.createdDate.split(" ")[0]
            if(!this.logMap.hasOwnProperty(createdDateKey))
                this.logMap[createdDateKey] = [f]
            else
                this.logMap[createdDateKey].push(f)
        })
        this.logMap = Object.keys(this.logMap).sort().reduce((obj, key) => { 
                this.logMap[key].sort((a,b)=>  new Date(b.createdDate) - new Date(a.createdDate) );
                obj[key] = this.logMap[key];
                return obj;
            }, 
            {}
        );
    },
    props: {
        logList: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        }
    },
    data(){
        return {
            logMap: {},
            activeNames: []
        }
    }
})
</script>
<style lang="sass" scoped>
</style>