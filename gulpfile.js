// gulp
import gulp from 'gulp'
import ifPlugin from 'gulp-if'
// del
import { deleteAsync } from 'del'
// gulpfile include concat html files
import fileinclude from 'gulp-file-include'
// gulp replace
import replace from 'gulp-replace'
// plumber
import plumber from 'gulp-plumber'
// notify
import notify from 'gulp-notify'
// browsersync
import browsersync from 'browser-sync'
// scss
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import rename from 'gulp-rename'
import autoprefixer from 'gulp-autoprefixer'
// js
import webpack from 'webpack-stream'
// zip
import gulpZip from 'gulp-zip'

// mode
const isBuild = process.argv.includes('--build')

// path's
import * as nodePath from 'path'

const rootFolder = nodePath.basename(nodePath.resolve())
const buildFolder = './public'
const srcFolder = './src'

// scss
const sass = gulpSass(dartSass)

// delete build folder
const reset = async () => {
	return deleteAsync(buildFolder)
}

// copy img folder with images
const copyImg = () => {
	return gulp.src( `${ srcFolder }/img/**/*.*` )
							.pipe(gulp.dest(`${ buildFolder }/img`))
}

const copyIcons = () => {
	return gulp.src( `${ srcFolder }/icomoon/**/*.*` )
							.pipe(gulp.dest(`${ buildFolder }/icomoon`))
}

// copy fonts
const copyFonts = () => {
	return gulp.src( `${ srcFolder }/fonts/**/*.*` )
							.pipe(gulp.dest(`${ buildFolder }/fonts`))
}

// copy scss
const copySCSS = () => {
	return gulp.src( `${ srcFolder }/scss/**/*.*` )
							.pipe(gulp.dest(`${ buildFolder }/scss`))
}

// copy js
const copyJS = () => {
	return gulp.src( `${ srcFolder }/js/**/*.*` )
							.pipe(gulp.dest(`${ buildFolder }/js`))
}

// copy images
const copyImages = () => {
	return gulp.src( `${ srcFolder }/img/**/*.*` )
							.pipe(gulp.dest(`${ buildFolder }/img`))
}

// server
const server = (done) => {
	browsersync.init({
		server: {
			baseDir: `${ buildFolder }/`
		},
		notify: false,
		port: 3000,
	})
}

// copy html
const html = () => {
	return gulp.src( `${ srcFolder }/*.html` )
							.pipe(plumber(
								notify.onError({
									title: "HTML",
									message: "Error <%= error.message %>"
								})
							))
							.pipe(fileinclude())
							.pipe(replace(/@img\//g, './img/'))
							.pipe(gulp.dest(`${ buildFolder }`))
							.pipe(browsersync.stream())
}

// scss
const scss = () => {
	return gulp.src(`${ srcFolder }/scss/style.scss`, { sourcemaps: !isBuild })
							.pipe(plumber(
								notify.onError({
									title: "SCSS",
									message: "Error <%= error.message %>"
								})
							))
							.pipe(sass({
								outputStyle: 'compressed'
							}))
							.pipe(ifPlugin(isBuild, 
								autoprefixer({
									grid: true,
									overrideBrowserslist: ['last 3 versions'],
									cascade: true,
								})	
							))
							.pipe(rename({
								extname: '.min.css'
							}))
							.pipe(gulp.dest(`${ buildFolder }/css`))
							.pipe(browsersync.stream())
}

// js
const js = () => {
	return gulp.src(`${ srcFolder }/js/script.js`, { sourcemaps: !isBuild })
							.pipe(plumber(
								notify.onError({
									title: "JS",
									message: "Error <%= error.message %>"
								})
							))
							.pipe(webpack({
								mode: isBuild ? 'production' : 'development',
								output: {
									filename: 'script.min.js'
								}
							}))
							.pipe(gulp.dest(`${ buildFolder }/js`))
							.pipe(browsersync.stream())
}

// copy all files
const copyFiles = async () => {
	copyImg()
	copySCSS()
	copyJS()
	copyImages()
	copyFonts()
	copyIcons()
}

// watcher
const watcher = () => {
	gulp.watch(`${ srcFolder }/img/**/*.*`, copyImg)
	gulp.watch(`${ srcFolder }/**/*.html`, html)
	gulp.watch(`${ srcFolder }/scss/**/*.scss`, scss)
	gulp.watch(`${ srcFolder }/js/**/*.js`, js)
	gulp.watch(`${ srcFolder }/img/**/*.*`, copyImages)
}

// zip archives
const zip = async () => {
	deleteAsync(`./${ rootFolder }.zip`)
	return gulp.src(`${ buildFolder }/**/*.*`, {})
							.pipe(plumber(
								notify.onError({
									title: "ZIP",
									message: "Error <%= error.message %>"
								})
							))
							.pipe(gulpZip(`${ rootFolder }.zip`))
							.pipe(gulp.dest('./'))
}

const mainTasks = gulp.parallel(copyFiles, html, scss, js)

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server))
const build = gulp.series(reset, mainTasks)
const deployZIP = gulp.series(reset, mainTasks, zip)

export { dev }
export { build }
export { deployZIP }
