
export const clickOutside = {
    bind(el, binding) {
        // 点击事件的回调
        const clickHandler = (event) => {
            // 如果点击的target是el的后代节点或el本身，即点在自己身上
            if (el.contains(event.target)) {
                return false;
            }
            // 否则就是点在外面，并且传了指令的绑定值，则执行value（函数）
            binding.value && binding.value(event);
        };
        // 挂载一份handler给el，是为了便于在unbind中解除事件监听
        el._clickOutside = clickHandler;
        document.addEventListener("click", clickHandler);
    },
    unbind(el) {
        document.removeEventListener("click", el._clickOutside);
        delete el._clickOutside;
    }
};