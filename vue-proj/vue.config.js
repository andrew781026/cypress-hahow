module.exports = {
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'Hahow 課程管理器';
                return args;
            })
    },
    pluginOptions: {
        electronBuilder: {
            preload: 'src/preload.js',
            // Or, for multiple preload files:
            // preload: { preload: 'src/preload.js', otherPreload: 'src/preload2.js' }
        }
    }
};
