<template>
    <div :class="selectClass">
        <div
            :class="selectionClass"
            :tabindex="disabled ? -1 : 0"
            @click.stop="toggleDropdown"
            v-clickoutside="() => setOpen(false)"
        >
            <template v-if="multiple">
                <div class="j-select-multiple-tags"></div>
            </template>
            <template v-else>
                <template v-if="filterable"></template>
                <template v-else>
                    <span v-if="value" class="j-select-selected">
                        <slot name="show-selected" :selected="value">
                            {{ value }}
                        </slot>
                    </span>
                    <span v-else class="j-select-placeholder">
                        <slot name="placeholder" :placeholder="placeholder">
                            {{ placeholder }}
                        </slot>
                    </span>
                    <i class="icon-xiala"></i>
                </template>
            </template>
        </div>
        <transition name="drop-down">
            <div :class="dropdownClass" v-if="isOpen" v-clickoutside="() => setOpen(false)">
                <ul class="j-select-list">
                    <li
                        v-for="(opt, i) in options"
                        :key="i"
                        class="j-select-option"
                        :class="getLiClass(opt, i)"
                        @click.stop="pickOption(opt, i)"
                    >
                        <slot name="option" :option="opt">
                            {{ getOptionKey(opt) }}
                        </slot>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>
import { clickOutside } from "@/directives/index";
import utils from "@/utils/utils";

const prefix = "j-select";
export default {
    name: "jSelect",
    props: {
        multiple: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        clearable: { type: Boolean, default: true },
        filterable: { type: Boolean, default: false },
        selectType: { type: String, default: "value" },
        options: { type: Array, default: () => [] },
        placeholder: { type: String, default: "请选择" },
        // 组件上使用v-model，相当于组件内部接收value prop
        value: { type: [String, Number, Object], default: null }
    },
    data() {
        return {
            // 是否显示下拉框
            isOpen: false,
            selectedIndex: -1,
            // 被选中的选项
            picked: []
        };
    },
    computed: {
        selectClass() {
            return {
                [prefix]: true,
                [prefix + "-multiple"]: this.multiple
            };
        },
        selectionClass() {
            return {
                [prefix + "-selection"]: true,
                [prefix + "-selection--active"]: this.isOpen,
                [prefix + "-selection--disabled"]: this.disabled
            };
        },
        dropdownClass() {
            return {
                [prefix + "-dropdown"]: true,
                [prefix + "-simple"]: !this.multiple,
                [prefix + "-multiple"]: this.multiple
            };
        }
    },
    methods: {
        toggleDropdown() {
            if (this.disabled) {
                this.setOpen(false);
            } else if (this.isOpen) {
                this.setOpen(false);
            } else {
                this.setOpen(true);
            }
        },
        getLiClass(option, index) {
            return {
                [prefix + "-option--selected"]: this.selectedIndex === index,
                [prefix + "-option--disabled"]: option.disabled
            };
        },
        setOpen(state) {
            this.isOpen = state;
        },
        pickOption(option, i) {
            if (this.disabled || option.disabled) {
                return;
            }
            if (this.multiple) {
                this.picked = utils.toggleVal(this.picked, option.value);
            } else {
                this.picked = option.value;
            }

            this.selectedIndex = i;
            // 派发input事件，将v-model绑定的值改为option，同时value prop也变为option
            this.$emit("input", this.picked);
            this.toggleDropdown();
        },
        getOptionKey(option) {
            return typeof option == "object" ? option.label : option;
        },
        parse() {
            if (this.multiple) {
                //
            } else {
                if (this.selectType == "value") {
                    this.picked = this.value;
                } else {
                    //
                }
            }
        }
    },
    directives: {
        // 点击外部 收起下拉框
        clickoutside: clickOutside
    },
    beforeMount() {
        this.parse();
    }
};
</script>

