const { override, fixBabelImports, addLessLoader } = require('customize-cra');
const path = require('path');
const fs = require('fs');
const rewireAliases = require('react-app-rewire-aliases');
const { paths } = require('react-app-rewired');


const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, 'src/ant-theme.less'), 'utf8'));


module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: themeVariables,
  }),
  rewireAliases.aliasesOptions({
    '@': path.resolve(__dirname, paths.appSrc),
  }),
);
