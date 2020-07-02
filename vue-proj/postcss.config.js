const IN_PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
    plugins: [
        IN_PRODUCTION && require('@fullhuman/postcss-purgecss')({
            content: [`./public/**/*.html`, `./src/**/*.vue`],
            fontFace: true,
            defaultExtractor(content) {
                const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '')
                return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
            },
            whitelistPatterns: [/-(leave|enter|appear)(|-(to|from|active))$/, /^(?!(|.*?:)cursor-move).+-move$/, /^router-link(|-exact)-active$/, /data-v-.*/, /el-.+$/],
            // 使用 /el-.+$/ 避免 element-ui 出問題 , 參考文章 : https://zhuanlan.zhihu.com/p/91463119
            whitelistPatternsChildren: [/el-.+$/, /@font-face/],
        })
    ],
}
