// tslint:disable
const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, `./custom-antd.less`), 'utf8'),
);

if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {};
  require.extensions['.css'] = (file) => {};
}

const nextConfigs = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = 'cheap-module-source-map';
    }

    return config;
  },
};

module.exports = withPlugins(
  [
    [
      withLess,
      {
        lessLoaderOptions: {
          javascriptEnabled: true,
          modifyVars: themeVariables,
        },
      },
    ],
    withCSS,
  ],
  nextConfigs,
);
