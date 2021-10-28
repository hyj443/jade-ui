<template>
    <div class="hello">
        <h1>{{ msg }}</h1>

        <j-btn @click="jclick" type="danger" size="small"> 猫子 </j-btn>

        <div style="width: 400px; margin: 20px auto">
            <j-slider v-model="sliderVal" :min="0"  :max="100" > </j-slider>
        </div>
    </div>
</template>

<script>
import jBtn from "./button/button";
import jSlider from "./slider/slider";
export default {
    name: "HelloWorld",
    props: {
        msg: String,
    },
    components: {
        jBtn,
        jSlider,
    },
    methods: {
        jclick() {
            alert("helloworld");
        },
    },
    data() {
        return {
            sliderVal: 20
        };
    },
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
