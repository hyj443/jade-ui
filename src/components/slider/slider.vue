<template>
    <div class="j-slider">
        <div class="j-slider-container">
            <div class="j-slider-line" @mousedown="locate"></div>
            <div
                class="j-slider-track"
                :style="trackStyle"
                @mousedown="locate"
            ></div>

            <div
                class="j-slider-node j-slider-end-node"
                :style="{ left: nodePosition.end }"
                @mousedown="dragNode('end', $event)"
            ></div>
        </div>
    </div>
</template>

<script>
import utils from "@/utils/utils";
export default {
    name: "jSlider",
    props: {
        readonly: { type: Boolean, default: false },
        step: { type: Number, default: 1 },
        multiple: { type: Boolean, default: false },
        showTip: { type: Boolean, default: true },
        min: { type: Number, default: 0 },
        max: { type: Number, default: 100 },
        value: { type: [Number, Object], default: 0 },
    },
    computed: {
        trackStyle() {
            const len = this.max - this.min;
            return {
                left: `${((this.values.start - this.min) / len) * 100}%`,
                right: `${((this.max - this.values.end) / len) * 100}%`,
            };
        },
        nodePosition() {
            const len = this.max - this.min;
            return {
                start: `${((this.values.start - this.min) / len) * 100}%`,
                end: `${100 - ((this.max - this.values.end) / len) * 100}%`,
            };
        },
        values() {
            if (!this.multiple) {
                return { start: this.min, end: this.value };
            }
            return Object.assign(
                { start: this.min, end: this.max },
                this.value
            );
        },
    },
    data() {
        return {
            nodeInfo: {
                side: null,
                initialVal: null,
                x: null,
            },
        };
    },
    methods: {
        locate(event) {
            if (this.multiple) return;
            // 获取右端点的位置信息
            let nodePos = this.$el
                .querySelector(".j-slider-end-node")
                .getBoundingClientRect();
            this.nodeInfo.side = "end";
            // 当前的右端点value
            this.nodeInfo.initialVal = this.values.end;
            // 右端点的x轴上的位置
            this.nodeInfo.x = nodePos.left + nodePos.width / 2;
            // 执行mouseMove，将右端点到达点击的位置
            this.mouseMove(event);
        },
        dragNode(side, event) {
            if (this.readonly) return;
            utils.addClass(event.target, "j-slider-node-dragging");
            this.nodeInfo.side = side;
            this.nodeInfo.initialVal = this.values[side];
            this.nodeInfo.x = event.clientX;
        },
        mouseMove(event) {
            if (this.readonly) return;
            // 需要移动的位移
            const dis = event.clientX - this.nodeInfo.x;
            // 不需要移动
            if (dis === 0) return;
            const lineLen = this.$el.querySelector(".j-slider-line")
                .clientWidth;
            // 变动的位移量与总长的比例
            const ratio = dis / lineLen;
            const deletaValue = parseInt(ratio * (this.max - this.min), 10);
            // 新的应该去到的值
            let newValue = this.nodeInfo.initialVal + deletaValue;
            // 求余数
            const remain = newValue % this.step;
            if (remain !== 0) {
                if (remain < this.step / 2) {
                    newValue = newValue - remain;
                } else {
                    newValue = newValue + this.step - remain;
                }
            }
            // 不能越界，约束一下
            newValue = Math.max(newValue, this.min);
            newValue = Math.min(newValue, this.max);

            let curValue = null;
            // let side = this.nodeInfo.side;

            if (this.multiple) {
                //
            } else {
                // 如果只有右端点，那newValue就是新值
                curValue = newValue;
                // 派发两个事件
                this.$emit("input", curValue);
                this.$emit("change", curValue);
                //
                // side = "end";
            }
            this.$emit("update:value", curValue);
        },
    },
};
</script>

