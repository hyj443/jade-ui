<template>
    <div :class="selectClass">
        <div :class="selectionClass">
            <template v-if="multiple"> </template>
            <template v-else>
                <template v-if="filterable"></template>
                <template v-else>
                    <span class="j-select-placeholder">
                        {{ placeholder }}
                    </span>
                </template>
            </template>
        </div>
        <div :class="listClass"></div>
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
        options: [Array, Object],
        placeholder: { type: String, default: "请选择" }
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
        listClass() {
            return {
                [prefix + "-list"]: true,
                [prefix + "-simple"]: !this.multiple,
                [prefix + "-multiple"]: this.multiple
            };
        }
    }
};
</script>

