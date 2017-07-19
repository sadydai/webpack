var webpack = require("webpack");
var path = require("path");

var nodeModPath = path.resolve(__dirname, './node_modules');
var glob = require('glob');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var map = getEntery();
var html = getHtml();
module.exports = {
    entry: map,
    output: {
        path: path.join(__dirname, "../dist"),
        filename: "js/[name].js"
    },
    module: {
        rules: [

            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 3000,
                    name: './assets/[name].[hash:5].[ext]'
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/octet-stream"
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file-loader"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=image/svg+xml"
            },
            {
                test: /\.html$/,
                loader: "raw-loader"
            }
        ]

    },
    plugins :[
        new ExtractTextPlugin('[name]/styles.css'),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
    ]
}

for (var pagename in html) {
    // 配置生成的html文件，定义路径等

    var conf = {
        filename: pagename + '.html',
        template: path.resolve(__dirname, '../src/tpl/'+ pagename +'.html'),   // 模板路径
        inject: false             // js插入位置
    };
    var entry = pagename;
    if (entry in module.exports.entry) {
        conf.chunks = ['vendors', entry];
        conf.hash = true;
        conf.inject = true
    }
    module.exports.plugins.push(new HtmlWebpackPlugin(conf));
}

function getEntery() {
    var jsDir = ('./src/**/*.js')
    var entryFiles = glob.sync(jsDir);
    var map = {};
    for (var i = 0; i < entryFiles.length; i++) {
        var filePath = entryFiles[i];
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        map[filename] = filePath;
    }
    return map;
}
function getHtml() {
    var jsDir =('./src/tpl/*.html')
    var entryFiles = glob.sync(jsDir);
    var html = {};
    for (var i = 0; i < entryFiles.length; i++) {
        var filePath = entryFiles[i];
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        html[filename] = filePath;
    }

    return html
}
