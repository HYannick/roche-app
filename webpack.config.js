module.exports = {
    entry: ['babel-polyfill','./public/js/script.js'],
    output : {
        path: './public/js',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader'

                    }
                ],
                exclude: /node_modules/

            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader",
                    options: {
                        minimize: true
                    }
                }, {
                    loader: "sass-loader"
                }],
                exclude: /node_modules/
            }
        ]
    }
};