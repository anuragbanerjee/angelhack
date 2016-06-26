
const webpack               = require('webpack');
const path                  = require('path');

const buildPath             = path.resolve(__dirname, './src/build');
const nodeModulesPath       = path.resolve(__dirname, 'node_modules');

const config = {

    // the file(s) to transpile
    entry: {
        RestaurantDashboard: ['./src/index.js']
    },

    // don't have to add extension for require by adding this feature
    resolve: {
        extensions: ["", ".js"]
    },

    // output config
    output: {
        path: buildPath,
        filename: '[name].js'
    },

    // loads the default babel-loader, which leads to transpiling the code before
    // webpack will do anything with it. So webpack treats it as normal js
    module: {
        loaders: [
            {
                test: /\.js$/, // All .js files
                loaders: ['babel-loader'], //react-hot is like browser sync and babel loads jsx and es6-7
                exclude: [nodeModulesPath]
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }
        ],
    },
};

module.exports = config;