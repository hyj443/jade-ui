<template>
    <div class="hello">
        <h1>{{ msg }}</h1>

        <j-btn @click="jclick" type="danger" size="small"> 猫子 </j-btn>

        <div style="width: 400px; margin: 20px auto">
           
            <j-select v-model="sliderVal" :options="param2"> </j-select> 
            
        </div>
    </div>
</template>

<script>
import jBtn from "./button/button";
import jSelect from "./select/select";
export default {
    name: "HelloWorld",
    props: {
        msg: String
    },
    components: {
        jBtn,
        jSelect
    },
    methods: {
        jclick() {
            alert("helloworld");
        }
    },
    data() {
        return {
            sliderVal: null,
             param2: [{ title: '选择0', key: 0 },{ title: '选择1', key: 'a1', other: '其他值' }, { title: '选择2', key: 'a2' }, { title: '选择3', key: 'a3' }]
        };
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>
