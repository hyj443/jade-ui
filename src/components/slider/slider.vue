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
const map = { start: "end", end: "start" };

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
        // 横条距离左边 右边的偏移量
        trackStyle() {
            const len = this.max - this.min;
            return {
                left: `${((this.values.start - this.min) / len) * 100}%`,
                right: `${((this.max - this.values.end) / len) * 100}%`
            }; 
        },
        // 左右端点距离左边的偏移量
        nodePosition() {
            const len = this.max - this.min;
            return {
                start: `${((this.values.start - this.min) / len) * 100}%`,
                end: `${100 - ((this.max - this.values.end) / len) * 100}%`
            };
        },
        // 左右端点对应的值
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
            // 当前操作的端点：是哪一端，值多少，距离左边的偏移量
            operatingNode: { side: null, val: null, pos: null }
        };
    },
    methods: {
        // 通过鼠标点击 将节点定位到新的位置
        locate(event) {
            // 返回端点的大小及其相对于视口的位置
            let startNodePos,
                endNodePos = this.getNode(
                    ".j-slider-end-node"
                ).getBoundingClientRect();
            // toMove表示将会移动的是哪个端点
            let toMove = "end";
            if (this.multiple) {
                // 如果是双端才会获取左端点的位置
                startNodePos = this.getNode(
                    ".j-slider-start-node"
                ).getBoundingClientRect();
                // 获取当前鼠标的水平坐标
                const mousePos = event.clientX;
                // 如果鼠标位置偏向左端点，则要移动的是左端点
                if (mousePos - startNodePos.left < endNodePos.left - mousePos) {
                    toMove = "start";
                }
            }
            // 确定要操作的端点的信息
            this.operatingNode.side = toMove;
            this.operatingNode.val = this.values[toMove];
            this.operatingNode.pos =
                toMove == "end"
                    ? endNodePos.left + endNodePos.width / 2
                    : startNodePos.left + startNodePos.width / 2;
            // 让端点跟随鼠标位置
            this.followMouse(event);
            // 鼠标按下后如果接着拖动，端点也跟着鼠标动
            document.body.addEventListener("mousemove", this.followMouse);
            document.body.addEventListener("mouseup", this.mouseUp);
            document.body.addEventListener("click", this.stop);
        },
        // 对着端点按下鼠标，拖动端点
        dragNode(side, event) {
            if (this.readonly) return;
            // 拖动中的样式
            utils.addClass(event.target, "j-slider-node-dragging");
            // 被拖动的端点的信息
            this.operatingNode.side = side;
            this.operatingNode.val = this.values[side];
            this.operatingNode.pos = event.clientX;
            // 做一套监听
            document.body.addEventListener("mousemove", this.followMouse);
            document.body.addEventListener("mouseup", this.mouseUp);
            document.body.addEventListener("click", this.stop);
        },
        // 端点将跟随鼠标的位置
        followMouse(event) {
            if (this.readonly) return;
            // 需要移动的偏移量
            const dis = event.clientX - this.operatingNode.pos;
            if (dis === 0) return;
            // 整长
            const lineLen = this.getNode(".j-slider-line").clientWidth;
            // 需要变化的百分比
            const percentage = dis / lineLen;
            // 需要变化的量
            const change = Math.round(percentage * (this.max - this.min));
            // 新值
            let newValue = this.operatingNode.val + change;
            // 根据step值调整
            newValue = Math.round(newValue / this.step) * this.step;
            // 根据范围进行约束
            newValue = Math.max(newValue, this.min);
            newValue = Math.min(newValue, this.max);
            // 将要更新的值
            let valueToSet;
            // 是否要变换拖动的端点
            let toSwitch = false;
            if (this.multiple) {
                // 如果新值已经超过右端点，且操作的是左端点
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
                    // 如果新值小于左端点，且操作的是右端点
                    newValue < this.values.start &&
                    this.operatingNode.side === "end"
                ) {
                    toSwitch = true;
                    valueToSet = Object.assign(this.values, {
                        start: newValue,
                        end: this.values.start
                    });
                } else {
                    // 其他情况，只需调整被操作的点的值
                    valueToSet = Object.assign(this.values, {
                        [this.operatingNode.side]: newValue
                    });
                }
            } else {
                valueToSet = newValue;
            }
            if (toSwitch) {
                // 被操作的端点要变更
                this.operatingNode.side = map[this.operatingNode.side];
                utils.removeClass(
                    this.getNode(".j-slider-node-dragging"),
                    "j-slider-node-dragging"
                );
                utils.addClass(
                    this.getNode(`.j-slider-${this.operatingNode.side}-node`),
                    "j-slider-node-dragging"
                );
            }
            // 更改v-model绑定的值
            this.$emit("input", valueToSet);
            this.$emit("change", valueToSet);
        },
        // 松开鼠标时执行
        mouseUp(event) {
            event.stopPropagation();
            if (this.readonly) return;
            // 取消事件的监听
            document.body.removeEventListener("mousemove", this.followMouse);
            document.body.removeEventListener("mouseup", this.mouseUp);
            document.body.removeEventListener("click", this.stop);
            // 移除端点的样式
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
