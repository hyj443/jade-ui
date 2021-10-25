<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
   
    
    <j-btn @click="jclick" type="danger" size="small">
      猫子
    </j-btn>
  </div>
</template>

<script>
import jBtn from "./button/button";
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components:{
      jBtn
  },
  methods:{
      jclick(){
          alert("helloworld")
      }
  }
}
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
