1. slot 在button组件中的使用
   1. vm.$slots 用来访问被插槽分发的内容。每个具名插槽有其相应的 property (例如：v-slot:foo 中的内容将会在 vm.$slots.foo 中被找到)。default property 包括了所有没有被包含在具名插槽中的节点，或 v-slot:default 的内容。
2. 引入less-loader意义
   1. less-loader：用于加载.less文件，将less转化为css
3. 在Webpack中，通过css-loader，可以实现在js文件中通过require的方式，来引入css
   1. css-loader：用于加载.css文件，将css转化为commonjs
4. TypeError: this.getOptions is not a function 
   1. 原因是less-loader版本过高，高版本要对应webpack5，但我4，因为我是cli4
   2. 下调到7.3的版本，配置vue.config.js
   3. 
   4. 