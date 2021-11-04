<template>
    <button
        type="button"
        :class="btnClass"
        :disabled="!!this.disabled"
        @click="handleClick"
    >
        <!-- 如果button的插槽位置没有节点，span标签就不会创建 -->
        <span v-if="$slots.default"><slot></slot></span>
    </button>
</template>

<script>
const prefix = "j-btn";
const sizeOptions = ["mini", "small", "normal", "big"];
export default {
    name: "jButton",
    data() {
        return {};
    },
    props: {
        type: String,
        outlined: Boolean,
        borderless: Boolean,
        block: Boolean,
        round: Boolean,
        loading: Boolean,
        size: {
            type: String,
            default: "normal",
            validator: (val) => sizeOptions.includes(val),
        },
        disabled: {type: Boolean, default: false},
    },
    computed: {
        btnClass() {
            return {
                [prefix + ""]: true,
                [prefix + "-round"]: this.round,
                [prefix + "-" + this.type]: !!this.type,
                [prefix + "-outlined"]: this.outlined,
                [prefix + "-borderless"]: this.borderless,
                [prefix + "-block"]: this.block,
                [prefix + "-loading"]: this.loading,
                [prefix + "-" + this.size]: true,
            };
        },
    },
    methods: {
        handleClick(event) {
            this.$emit("click", event);
        },
    },
};
</script>

