import Button from '@/components/button';
import Slider from '@/components/slider';

const components = {
    Button,
    Slider
};

const install = function (Vue, options = {}) {
    if (install.installed) {
        return;
    }

    for (const key in components) {
        if (components.hasOwnProperty(key)) {
            const component = components[key];

            Vue.component(key, component);
            Vue.component('j-' + key.toLocaleLowerCase(), component);

            if (!key.startsWith('j')) {
                Vue.component('j' + key, component);
            }
        }
    }
};

if (typeof window!=="undefined"&& window.Vue) {
    install(window.Vue)
}
