const {
  series,
  src,
  dest,
  watch
} = require("gulp");
const uglify = require("gulp-uglify"); // js 文件压缩 不支持es6
const htmlClean = require("gulp-htmlclean"); // html 压缩
const less = require("gulp-less"); // less 文件编译为css文件
const cleanCss = require("gulp-clean-css"); // css文件压缩
const deBugClean = require("gulp-strip-debug"); // 去除断点 debugger
const imagemin = require("gulp-imagemin"); // 压缩图片文件
const connect = require("gulp-connect"); // 服务器

const folder = {
  src: "src/",
  dist: "dist/"
} // 设置输入输出起始路径

function html() {
  return src(`${folder.src}html/*`)
    .pipe(htmlClean())
    .pipe(dest(`${folder.dist}html/`))
    // .pipe(connect.reload());
}

function js() {
  return src(`${folder.src}js/*`)
    .pipe(deBugClean())
    .pipe(uglify())
    .pipe(dest(`${folder.dist}js/`))
    // .pipe(connect.reload());
}

function css(cb) {
  return src(`${folder.src}css/*`)
    .pipe(less())
    .pipe(cleanCss())
    .pipe(dest(`${folder.dist}css/`))
    // .pipe(connect.reload());
}

function image() {
  return src(`${folder.src}images/*`)
    // .pipe(imagemin())
    .pipe(dest(`${folder.dist}images/`))
}

function server(cb) {
  connect.server({
    port: "1573",
    livereload: true, //自动刷新
  })
  cb();
}

// 热更新 重新加载三个文件
watch(`${folder.src}html/*`, function (cb) {
  html();
  cb();
})
watch(`${folder.src}js/*`, function (cb) {
  js();
  cb();
})
watch(`${folder.src}css/*`, function (cb) {
  css();
  cb();
})
exports.default = series(html, css, js, image, server)