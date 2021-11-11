<template>
    <div class="hello">
        <h1>{{ msg }}</h1>

        <j-btn @click="jclick" type="danger" size="small"> 猫子 </j-btn>

        <div style="width: 400px; margin: 20px auto">
            <div>start:{{ sliderVal.start }} end:{{ sliderVal.end }}</div>
            <j-slider v-model="sliderVal" :min="20" :max="200" multiple>
            </j-slider>
            <j-select v-model="selectVal" @change="getValue" :options="param2">
            </j-select>
        </div>
    </div>
</template>

<script>
import jBtn from "./button/button";
import jSelect from "./select/select";
import jSlider from "./slider/slider";

export default {
    name: "HelloWorld",
    props: {
        msg: String
    },
    components: {
        jBtn,
        jSelect,
        jSlider
    },
    methods: {
        jclick() {
            alert("helloworld");
        },
        getValue(a) {
            debugger;
            a;
            this.selectVal;
        }
    },
    data() {
        return {
            sliderVal: {
                start: 42,
                end: 78
            },
            selectVal: "",
            param2: [
                { value: "选择1", label: "a1" ,disabled:true},
                { value: "选择2", label: "a2" },
                { value: "选择3", label: "a3" }
            ]
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
