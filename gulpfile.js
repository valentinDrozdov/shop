const { src, dest, watch, series, parallel } = require('gulp')
const browserSync = require('browser-sync').create()
const fileInclude = require('gulp-file-include')
const del = require('del')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const mediaQueries = require('gulp-group-css-media-queries')
const rename = require('gulp-rename')
const cleancss = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const webpconv = require('gulp-webp')
const svgSprite = require('gulp-svg-sprite')
const webpackStream = require('webpack-stream')
const woff = require('gulp-ttf2woff')
const woff2 = require('gulp-ttf2woff2')
const fs = require('fs')
const gulpPug = require('gulp-pug')
const gulp = require('gulp')

let project_folder = 'dist'
let source_folder = 'src'
let assets_folder = "assets"

let path = {
    build: {
        html: project_folder + '/',
        css: project_folder + '/' + assets_folder + '/css/',
        js: project_folder + '/' + assets_folder + '/js/',
        img: project_folder + '/' + assets_folder + '/img/',
        sprite: project_folder + '/' + assets_folder + '/img/',
        fonts: project_folder + '/' + assets_folder + '/fonts/',
    },

    src: {
        html: source_folder + '/**/*.html',
        scss: source_folder + '/' + assets_folder + '/scss/**/index.{css,scss,sass,less,styl}',
        js: source_folder + '/' + assets_folder + '/js/**/*.js',
        imgToWebp: source_folder + '/' + assets_folder + '/img/**/*.{jpg,jpeg,webp,png}',
        img: source_folder + '/' + assets_folder + '/img/**/*.{svg, gif, ico}',
        svgImg: source_folder + '/' + assets_folder + '/img/**/*.svg',
        fonts: source_folder + '/' + assets_folder + '/fonts/**/*.ttf',
        pug: source_folder + '/pug/pages/' + '*.pug',
    },

    observation: {
        html: source_folder + '/**/*.html',
        css: source_folder + '/' + assets_folder + '/scss/**/*.{css,scss,sass,less,styl}',
        imgToWebp: source_folder + '/' + assets_folder + '/img/**/*.{jpg,jpeg,webp,png}',
        js: source_folder + '/' + assets_folder + '/js/**/*.js',
        img: source_folder + '/' + assets_folder + '/img/**/*.{gif,svg,ico}',
        svg: source_folder + '/' + assets_folder + '/img/**/*.svg',
        fonts: source_folder + '/' + assets_folder + '/fonts/**/*.ttf',
        pug: source_folder + '/pug/**/*.pug',

    },

    clean: './' + project_folder + '/',
}

function fonts() {
    src(path.src.fonts)
        .pipe(woff())
        .pipe(dest(path.build.fonts))
    return src(path.src.fonts)
        .pipe(woff2())
        .pipe(dest(path.build.fonts))
}

function sprite () {
    return src(path.src.svgImg)
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(dest(path.build.sprite))
}

function browsersync () {
    browserSync.init({
        server:{
            baseDir: `./${project_folder}/`
        },
        online: true,
    })
}

function html () {
    return src(path.src.html)
        .pipe(fileInclude())
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream())
}

function pug () {
    return src(path.src.pug)
        .pipe(gulpPug())
        .pipe(dest(path.build.html))
        .pipe(browserSync.stream())
}

function js () {
    return src(path.src.js)
        .pipe(webpackStream({
            output: {
                filename: 'index.js'
            },
            module: {
                rules: [
                    {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                        presets: ['@babel/preset-env']
                        }
                    }
                    }
                ]
            }
        }))
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest(path.build.js))
        .pipe(browserSync.stream())
}

function scss () {
    return src(path.src.scss)
        .pipe(sass({
            outputStyle: 'expanded',
        }))
        .pipe(autoprefixer({
            overrideBrowserlist: ['last 5 versions']
        }))
        .pipe(mediaQueries())
        .pipe(dest(path.build.css))
        .pipe(cleancss())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream())
}

function imagesToWebp () {
    return src(path.src.imgToWebp)
        .pipe(dest(path.build.img))
        .pipe(webpconv({
            quality: 70,
        }))
        .pipe(rename({
            extname: '.webp'
        }))
        .pipe(dest(path.build.img))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewbox: false}],
            interlaced: true,
            optimizationLevel: 3
        }))
        .pipe(dest(path.build.img))
        .pipe(browserSync.stream())
}

function images () {
    return src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewbox: false}],
            interlaced: true,
            optimizationLevel: 3
        }))
        .pipe(dest(path.build.img))
        .pipe(browserSync.stream())
}

function watchFiles () {
    watch([path.observation.html], html)
    watch([path.observation.css], scss)
    watch([path.observation.js], js)
    watch([path.observation.imgToWebp], imagesToWebp)
    watch([path.observation.img], images)
    watch([path.observation.svg], sprite)
    watch([path.observation.fonts], fonts)
    watch([path.observation.pug], pug)
}

function clean () {
    return del(path.clean)
}

function cb() { }

const srcFonts =  source_folder + '/' + assets_folder + '/' + '/scss/fonts.scss';
const appFonts =  project_folder + '/' + assets_folder + '/fonts/';

function fontsStyle(done) {
	let file_content = fs.readFileSync(srcFonts);

	fs.writeFile(srcFonts, '', cb);
	fs.readdir(appFonts, function (err, items) {
		if (items) {
			let c_fontname;
			for (var i = 0; i < items.length; i++) {
				let fontname = items[i].split('.');
				fontname = fontname[0];
				if (c_fontname != fontname) {
					fs.appendFile(srcFonts, `@include font("${fontname}", "${fontname}", 400, 'normal')\r\n`, cb);
				}
				c_fontname = fontname;
			}
		}
	})

	done();
}

const build = series(clean, parallel(fonts, sprite, html, pug, scss, js, images, imagesToWebp))
const watching = parallel(build, watchFiles, browsersync)


exports.default = watching
exports.fonts = fontsStyle
