<template>
    <div :class="selectClass">
        <div
            :class="selectionClass"
            @click="toggleDropdown"
            v-clickoutside="() => setOpen(false)"
        >
            <template v-if="multiple"> </template>
            <template v-else>
                <template v-if="filterable"></template>
                <template v-else>
                    <span v-if="value.value" class="j-select-selected">
                        <slot name="show-selected" :selected="value">
                            {{ value.label }}
                        </slot>
                    </span>
                    <span v-else class="j-select-placeholder">
                        <slot name="placeholder" :placeholder="placeholder">
                            {{ placeholder }}
                        </slot>
                    </span>
                </template>
            </template>
        </div>
        <transition name="drop-down">
            <div :class="dropdownClass" v-if="isOpen">
                <ul class="j-select-list">
                    <li
                        v-for="(opt, i) in options"
                        :key="i"
                        class="j-select-option"
                        :class="getLiClass(opt, i)"
                        @click="pickOption(i)"
                    >
                        {{ getOptionKey(opt) }}
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>
import { clickOutside } from "@/directives/index";

const prefix = "j-select";
export default {
    name: "jSelect",
    props: {
        multiple: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        clearable: { type: Boolean, default: true },
        filterable: { type: Boolean, default: false },
        options: { type: Array, default: () => [] },
        placeholder: { type: String, default: "请选择" },
        value: { type: [String, Number, Object], default: null }
    },
    data() {
        return {
            isOpen: false,
            selectedIndex: -1
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
                [prefix + "-selection-disabled"]: this.disabled
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
                return;
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
        pickOption(i) {
            this.selectedIndex = i;
            const opt = this.options[i];
            this.$emit("input", opt);
            this.toggleDropdown();
        },
        getOptionKey(option) {
            return typeof option == "object" ? option.label : option;
        }
    },
    directives: {
        clickoutside: clickOutside
    }
};
</script>

