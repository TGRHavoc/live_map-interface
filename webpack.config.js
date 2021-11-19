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
        publicPath: "dist/",
        clean: true
    }
};

module.exports = (env, argv) => {
    return config;
};
