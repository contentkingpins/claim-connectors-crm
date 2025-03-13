module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable minification which is causing issues with terser-webpack-plugin
      if (webpackConfig.optimization && webpackConfig.optimization.minimizer) {
        webpackConfig.optimization.minimizer = [];
      }
      
      // Resolve the ajv dependency issues
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        fallback: {
          ...webpackConfig.resolve?.fallback,
          fs: false,
          path: false,
          crypto: false
        }
      };
      
      return webpackConfig;
    }
  },
  typescript: {
    enableTypeChecking: false // Disable type checking during build for better performance
  },
  eslint: {
    enable: false // Disable eslint during build for better performance
  }
}; 