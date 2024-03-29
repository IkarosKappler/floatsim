module.exports = {
  mode: "production",

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    // extensions: [".js", ".ts", ".tsx"]
  },

  module: {
    rules: [
      //   {
      //     test: /\.ts(x?)$/,
      //     exclude: /node_modules/,
      //     use: [
      //       {
      //         loader: "ts-loader"
      //       }
      //     ]
      //   },
      //   // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      //   {
      //     enforce: "pre",
      //     test: /\.js$/,
      //     loader: "source-map-loader"
      //   }
      // loaders: [
      //   {
      //     test: /src\/shaders\/\.(glsl|vs|fs|frag|vert)$/,
      //     loader: "ts-shader-loader"
      //   }
      {
        test: /src\/shaders\/\.*(glsl|vs|fs|frag|vert)$/,
        loader: "webpack-glsl"
      }
      // ]
    ]
  },

  performance: {
    hints: false, // 'error'
    maxEntrypointSize: 400000
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  //   externals: {
  //     "react": "React",
  //     "react-dom": "ReactDOM"
  //   }

  externals: {
    "THREE": "three"
  }
};
