const notBlank = /\S+/g;
const rclass = /[\t\r\n\f]/g;


const getClass = (el) => {
    return el.getAttribute("class") || "";
};


export default {
    addClass(el, newName) {
        if (!el || typeof newName !== "string" || !newName) {
            return;
        }
        const nameToAdd = newName.match(notBlank) || [];
        const curValue = getClass(el);
        if (el.nodeType === 1) {
            let cur = (" " + curValue + " ").replace(rclass, " ");
            if (cur) {
                for (const name of nameToAdd) {
                    if (cur.indexOf(" " + name + " ") === -1) {
                        cur += name + " ";
                    }
                }
                const res = cur.trim();
                if (res !== curValue) {
                    el.setAttribute("class", res);
                }
            }
        }
    },
    removeClass(el, name) {
        if (!el || typeof name !== "string" || !name) {
            return;
        }
        const nameToRemove = name.match(notBlank) || [];
        const curValue = getClass(el);

        if (el.nodeType === 1) {
            let cur = (" " + curValue + " ").replace(rclass, " ");
            if (cur) {
                for (const name of nameToRemove) {
                    if (cur.indexOf(" " + name + " ") > -1) {
                        cur = cur.replace(" " + name + " ", " ");
                    }
                }
                const res = cur.trim();
                if (res !== curValue) {
                    el.setAttribute("class", res);

                }
            }
        }
    }
};


