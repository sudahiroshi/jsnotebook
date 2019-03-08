import {
  task, src, dest, series, parallel, watch,
} from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import frontMatter from 'gulp-front-matter';
import layout from 'gulp-layout';
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import rename from 'gulp-rename';
import webpackStream from 'webpack-stream';

import showdown from 'showdown';
import del from 'del';
import webpack from 'webpack';
import webpackConfig from './webpack.config';
import markdown from './gulp_modules/gulp-showdown/gulp-showdown';

const createErrorHandler = ns => notify.onError(`[${ns}] <%= error %>`);
const path = {
  root: { src: 'src', dest: 'dist' },
  markdown: { src: 'src/templates/md', dest: 'dist' },
  scss: { src: 'src/styles', dest: 'dist/css' },
  js: { src: 'src/scripts', dest: 'dist/js' },
  asset: { src: 'src/assets', dest: 'dist' },
};

// markdown to html
task('markdown', () => src(`${path.markdown.src}/**/*.md`)
  .pipe(plumber({ errorHandler: createErrorHandler('markdown') }))
  .pipe(frontMatter({ remove: true }))
  .pipe(markdown(showdown.getFlavorOptions('github')))
  .pipe(layout(file => file.frontMatter))
  .pipe(
    rename({
      extname: '.html',
    }),
  )
  .pipe(dest(path.markdown.dest)));

// scss to css
task('scss', () => src(`${path.scss.src}/**/*.scss`)
  .pipe(plumber({ errorHandler: createErrorHandler('scss') }))
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([
    autoprefixer({
      cascade: true,
    }),
  ]))
  .pipe(
    rename({
      extname: '.css',
    }),
  )
  .pipe(dest(path.scss.dest)));

// script transpile
task('js', () => src(`${path.js.src}/**/*.js`)
  .pipe(plumber({ errorHandler: createErrorHandler('js') }))
  .pipe(webpackStream({ ...webpackConfig }, webpack))
  .pipe(dest(path.js.dest)));

// assets
task('asset', () => src(`${path.asset.src}/**/*.*`, { base: path.asset.src })
  .pipe(dest(path.asset.dest)));

// clean up dist
task('clean', () => del([
  `${path.root.dest}/**/*.*`,
]));

// build
task('build', series('clean', 'asset', parallel('scss', 'js', 'markdown')));

// watch
task('watch', () => {
  watch(`${path.root.src}/**`, series('build'));
});
