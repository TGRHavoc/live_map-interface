const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

var config = {
    mode: "production",
    devtool: "source-map",

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ],
    },
    entry: {
        index: "./src/js/_app.js"
    },
    plugins: [
        // Dev build, for dev server
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html",
        }),
        // Production build
        new HtmlWebpackPlugin({
            title: "Havoc's LiveMap",
            template: "./public/index.html",
            hash: true,
            inject: true,
            filename: "../index.html",
            minify: {
                collapseWhitespace: true,
                removeComments: true,
            }
        }),
    ],
    output: {
        filename: "livemap.[fullhash].js",
        path: path.resolve(__dirname, "dist"),
        // publicPath: "dist/",
        clean: true
    },
    devServer: {
        static: [
            {
              directory: path.join(__dirname, 'images'),
              publicPath: "/images"
            },
        ],
        compress: true,
        port: 9000,
    },
};

module.exports = (env, argv) => {
    return config;
};
