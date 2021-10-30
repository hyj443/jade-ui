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
                v-if="multiple"
                class="j-slider-node j-slider-start-node"
                :style="{ left: nodePosition.start }"
                @mousedown="dragNode('start', $event)"
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
        // 横条的样式
        trackStyle() {
            const len = this.max - this.min;
            return {
                left: `${((this.values.start - this.min) / len) * 100}%`,
                right: `${((this.max - this.values.end) / len) * 100}%`,
            };
        },
        // 左右节点的相对偏移
        nodePosition() {
            const len = this.max - this.min;
            return {
                start: `${((this.values.start - this.min) / len) * 100}%`,
                end: `${100 - ((this.max - this.values.end) / len) * 100}%`,
            };
        },
        // 左右节点对应的值
        values() {
            if (this.multiple) {
                return Object.assign(
                    { start: this.min, end: this.max },
                    this.value
                );
            }
            return { start: this.min, end: this.value };
        },
    },
    data() {
        return {
            // 当前节点的信息 属于哪一端 初始值 位置
            nodeInfo: {
                side: null,
                initialVal: null,
                pos: null,
            },
        };
    },
    methods: {
        // 通过鼠标点击 将节点定位到新的位置
        locate(event) {
            const endNodePos = this.$el
                .querySelector(".j-slider-end-node")
                .getBoundingClientRect();

            if (this.multiple) {
                const startNodePos = this.$el
                    .querySelector(".j-slider-start-node")
                    .getBoundingClientRect();
                const mousePos = event.clientX;
                if (mousePos - startNodePos.left < endNodePos.left - mousePos) {
                    this.nodeInfo.side = "start";
                    this.nodeInfo.initialVal = this.values.start;
                    this.nodeInfo.pos =
                        startNodePos.left + startNodePos.width / 2;
                }
            } else {
                this.nodeInfo.side = "end";
                this.nodeInfo.initialVal = this.values.end;
                this.nodeInfo.pos = endNodePos.left + endNodePos.width / 2;
            }

            this.followMouse(event);
            document.body.addEventListener("mousemove", this.followMouse);
            document.body.addEventListener("mouseup", this.mouseUp);
        },
        dragNode(side, event) {
            if (this.readonly) return;
            utils.addClass(event.target, "j-slider-node-dragging");
            this.nodeInfo.side = side;
            this.nodeInfo.initialVal = this.values[side];
            this.nodeInfo.pos = event.clientX;
            document.body.addEventListener("mousemove", this.followMouse);
            document.body.addEventListener("mouseup", this.mouseUp);
        },
        // 节点将跟随鼠标的位置
        followMouse(event) {
            if (this.readonly) return;
            const dis = event.clientX - this.nodeInfo.pos;
            if (dis === 0) return;
            const lineLen = this.$el.querySelector(".j-slider-line")
                .clientWidth;

            const ratio = dis / lineLen;
            const deletaValue = parseInt(ratio * (this.max - this.min), 10);
            let newValue = this.nodeInfo.initialVal + deletaValue;
            const remain = newValue % this.step;
            if (remain !== 0) {
                if (remain < this.step / 2) {
                    newValue = newValue - remain;
                } else {
                    newValue = newValue + this.step - remain;
                }
            }
            newValue = Math.max(newValue, this.min);
            newValue = Math.min(newValue, this.max);
            let curValue = null;
            if (this.multiple) {
                if (this.nodeInfo.side == "start") {
                    curValue = Object.assign(
                        { start: this.values.start, end: this.values.end },
                        { start: newValue }
                    );
                } else {
                    curValue = Object.assign(
                        { start: this.values.start, end: this.values.end },
                        { end: newValue }
                    );
                }
            } else {
                curValue = newValue;
            }
            this.$emit("input", curValue);
            this.$emit("change", curValue);
            this.$emit("update:value", curValue);
        },
        mouseUp(event) {
            event;
            document.body.removeEventListener("mousemove", this.followMouse);
            document.body.removeEventListener("mouseup", this.mouseUp);
            const node = this.$el.querySelector(".j-slider-node-dragging");
            if (node) {
                utils.removeClass(node, "j-slider-node-dragging");
            }
        },
    },
};
</script>

