<template>
    <div :class="selectClass">
        <div :class="selectionClass" @click="toggleDropdown">
            <template v-if="multiple"> </template>
            <template v-else>
                <template v-if="filterable"></template>
                <template v-else>
                    <span class="j-select-placeholder">
                        {{ value || placeholder }}
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
                        :class="
                            selectedIndex === i && 'j-select-option--selected'
                        "
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
const prefix = "j-select";
export default {
    name: "jSelect",
    props: {
        multiple: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        clearable: { type: Boolean, default: true },
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
                [prefix + "-multiple"]: this.multiple,
                [prefix + "-disabled"]: this.disabled
            };
        },
        selectionClass() {
            return {
                [prefix + "-selection"]: true
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
                this.isOpen = false;
                return;
            } else if (this.isOpen) {
                this.isOpen = false;
                //
            } else {
                this.isOpen = true;
            }
        },
        pickOption(i) {
            this.selectedIndex = i;
            const opt = this.options[i];
            // this.$emit("update:value", opt);
            // this.$emit("change", opt);
            this.$emit("input", opt);
            this.value
        },
        getOptionKey(option) {
            return typeof option == "object" ? option.key : option;
        }
    }
};
</script>

