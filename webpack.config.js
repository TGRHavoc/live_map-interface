/* eslint-disable */

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

var config = {
    mode: "production",
    devtool: "eval-cheap-module-source-map",
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
        style: "./src/sass/main.scss",
        app: "./src/js/_app.js",
    },
    optimization: {
        runtimeChunk: "single"
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
            },
        }),
    ],
    output: {
        filename: "[name].[fullhash].js",
        path: path.resolve(__dirname, "dist"),
        // publicPath: "dist/",
        clean: true,
    },
    performance: {
        maxEntrypointSize: 5242880,
        maxAssetSize: 5242880
    },
    devServer: {
        static: [
            {
                directory: path.join(__dirname, "images"),
                publicPath: "/images",
            },
            {
                directory: path.join(__dirname, "translations"),
                publicPath: "/translations",
            },
            {
                directory: path.join(__dirname, "public", "dev"),
                publicPath: "/",
            }
        ],
        compress: true,
        port: 9000,
    },
};

module.exports = (env, argv) => {
    return config;
};
