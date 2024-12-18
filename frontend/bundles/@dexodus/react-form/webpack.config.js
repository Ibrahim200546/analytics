const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './index.ts',
    output: {
        filename: 'index.js', // <-- Important
        libraryTarget: 'this' // <-- Important
    },
    target: 'node', // <-- Important
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.module\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                    },
                ],
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.scss']
    },
    externals: [nodeExternals()] // <-- Important
};
