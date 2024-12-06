const path = require("path");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
module.exports = {
    mode: 'production',
    context: __dirname,
    entry: {
        main: "./src/main.ts",
    },
    output: {
        library: {
          name: "GlVsGpu",
          type: "umd",
          umdNamedDefine: true
        },
        filename: "gl-vs-gpu.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/dist/",
    },
    watchOptions: {
        // for some systems, watching many files can result in a lot of CPU or memory usage
        // https://webpack.js.org/configuration/watch/#watchoptionsignored
        // don't use this pattern, if you have a monorepo with linked packages
        ignored: /node_modules/,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader"
                }
            },
            {
                test: /\.wgsl$/,
                use: {
                    loader: "ts-shader-loader"
                }
            },
            {
                test: /\.(glsl|vs|fs)$/,
                use: {
                    loader: "ts-shader-loader"
                }
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
          typescript: {
            memoryLimit: 4096, // 增加内存限制，避免内存不足错误
          },
        }),
      ],
    resolve: {
        extensions: [".ts"]
    },
    optimization: {
      minimize: false,
    },
}
