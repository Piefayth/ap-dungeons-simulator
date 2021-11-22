const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [{
    mode: 'development',
    entry: {
        sim: './simulator/src/index.ts',
        web: {
            import: './website/src/index.tsx',
            dependOn: 'sim'
        }
    },
    optimization: {
        usedExports: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader',
                }]
            },
            {
                test: /\.less$/,
                use: [
                  'style-loader',
                  { loader: 'css-loader', options: { importLoaders: 1 } },
                  {
                    loader: 'less-loader', options: { 
                        lessOptions: {
                            javascriptEnabled: true
                        }
                     },
                  },
                ],
              },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [new HtmlWebpackPlugin()]
}];