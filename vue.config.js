const path = require("path");
const resolve = (dir) => {
    return path.join(__dirname, dir);
};
module.exports = {
    chainWebpack: (config) => {
        config.resolve.alias.set("@", resolve("./src"));
    },
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    javascriptEnabled: true,
                    globalVars: {
                        primary: '#fff'
                    }
                }
            }
        }
    }
};
