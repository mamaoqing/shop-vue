module.exports = {
    baseUrl: './',
    outputDir: 'dist',
    assetsDir: 'assets',
    lintOnSave: false,
    devServer: {
        port: 8900,
        open: false,
        https: false,
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
            '/api':{
                target:'http://localhost:7001/',
                changeOrigin: true,
                ws: true,
                write: {
                    encode: true
                },
                pathRewrite: {
                    '^/api': '/web'
                }
            }
        }
    }
}

