const sass = require('sass');
const globImporter = require('node-sass-glob-importer');

console.log({
    file: __dirname + "/sass/base.scss",
    importer: globImporter(),
    pkgImporter: new sass.NodePackageImporter()
})

const result = sass.renderSync(
    {
        file:  __dirname + "/sass/base.scss",
        outFile: __dirname + "../../../dist/themes/base/css/base.css",
        importer: [globImporter(), new sass.NodePackageImporter()]
    }
)
// console.log(result.css.toString());