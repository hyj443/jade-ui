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
const getOpposite = { start: "end", end: "start" };

export default {
    name: "jSlider",
    props: {
        readonly: { type: Boolean, default: false },
        step: { type: Number, default: 1 },
        multiple: { type: Boolean, default: false },
        showTip: { type: Boolean, default: true },
        min: { type: Number, default: 0 },
        max: { type: Number, default: 100 },
        value: { type: [Number, Object], default: 0 }
    },
    computed: {
        // 横条的样式
        trackStyle() {
            const len = this.max - this.min;
            return {
                left: `${((this.values.start - this.min) / len) * 100}%`,
                right: `${((this.max - this.values.end) / len) * 100}%`
            };
        },
        // 左右节点的相对偏移
        nodePosition() {
            const len = this.max - this.min;
            return {
                start: `${((this.values.start - this.min) / len) * 100}%`,
                end: `${100 - ((this.max - this.values.end) / len) * 100}%`
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
        }
    },
    data() {
        return {
            operatingNode: {
                side: null,
                val: null,
                pos: null
            }
        };
    },
    methods: {
        // 通过鼠标点击 将节点定位到新的位置
        locate(event) {
            let startNodePos,
                endNodePos = this.getNode(
                    ".j-slider-end-node"
                ).getBoundingClientRect();
            let toMove = "end";
            if (this.multiple) {
                startNodePos = this.getNode(
                    ".j-slider-start-node"
                ).getBoundingClientRect();
                const mousePos = event.clientX;
                if (mousePos - startNodePos.left < endNodePos.left - mousePos) {
                    toMove = "start";
                }
            }
            this.operatingNode.side = toMove;
            this.operatingNode.val = this.values[toMove];
            this.operatingNode.pos =
                toMove == "end"
                    ? endNodePos.left + endNodePos.width / 2
                    : startNodePos.left + startNodePos.width / 2;

            this.followMouse(event);
            document.body.addEventListener("mousemove", this.followMouse);
            document.body.addEventListener("mouseup", this.mouseUp);
            document.body.addEventListener("click", this.stop);
        },
        dragNode(side, event) {
            if (this.readonly) return;
            utils.addClass(event.target, "j-slider-node-dragging");
            this.operatingNode.side = side;
            this.operatingNode.val = this.values[side];
            this.operatingNode.pos = event.clientX;
            document.body.addEventListener("mousemove", this.followMouse);
            document.body.addEventListener("mouseup", this.mouseUp);
            document.body.addEventListener("click", this.stop);
        },
        // 节点将跟随鼠标的位置
        followMouse(event) {
            if (this.readonly) return;
            const dis = event.clientX - this.operatingNode.pos;
            if (dis === 0) return;
            const lineLen = this.getNode(".j-slider-line").clientWidth;
            const percentage = dis / lineLen;
            const change = Math.round(percentage * (this.max - this.min));
            let newValue = this.operatingNode.val + change;
            newValue = Math.round(newValue / this.step) * this.step;
            newValue = Math.max(newValue, this.min);
            newValue = Math.min(newValue, this.max);
            let valueToSet;
            let toSwitch = false;
            if (this.multiple) {
                if (
                    newValue > this.values.end &&
                    this.operatingNode.side === "start"
                ) {
                    toSwitch = true;
                    valueToSet = Object.assign(this.values, {
                        start: this.values.end,
                        end: newValue
                    });
                } else if (
                    newValue < this.values.start &&
                    this.operatingNode.side === "end"
                ) {
                    toSwitch = true;
                    valueToSet = Object.assign(this.values, {
                        start: newValue,
                        end: this.values.start
                    });
                } else {
                    valueToSet = Object.assign(this.values, {
                        [this.operatingNode.side]: newValue
                    });
                }
            } else {
                valueToSet = newValue;
            }
            if (toSwitch) {
                this.operatingNode.side = getOpposite[this.operatingNode.side];
                utils.removeClass(
                    this.getNode(".j-slider-node-dragging"),
                    "j-slider-node-dragging"
                );
                utils.addClass(
                    this.getNode(`.j-slider-${this.operatingNode.side}-node`),
                    "j-slider-node-dragging"
                );
            }
            this.$emit("input", valueToSet);
            this.$emit("change", valueToSet);
            this.$emit("update:value", valueToSet);
        },
        mouseUp(event) {
            event.stopPropagation();
            if (this.readonly) return;
            document.body.removeEventListener("mousemove", this.followMouse);
            document.body.removeEventListener("mouseup", this.mouseUp);
            document.body.removeEventListener("click", this.stop);
            utils.removeClass(
                this.getNode(".j-slider-node-dragging"),
                "j-slider-node-dragging"
            );
        },
        stop(event) {
            event.stopPropagation();
        },
        getNode(name) {
            return this.$el.querySelector(name);
        }
    }
};
</script>
