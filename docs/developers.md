---
layout: default
title: Development
nav_order: 2
has_children: true
parent: LiveMap Interface
---

# Developer Information <!-- omit in toc -->

If you're looking to customize the interface for your community or, want to improve it for all then this should help you get started.

- [Step 1: Fork & Clone](#step-1-fork--clone)
- [Step 2: Installing Dependencies](#step-2-installing-dependencies)
- [Step 3: Edit code](#step-3-edit-code)
  - [Editing JS files](#editing-js-files)
  - [Editing SCSS files](#editing-scss-files)
- [Step 4: Build!](#step-4-build)

## Step 1: Fork & Clone

So. The first thing you're going to need to do is fork & clone this repository.
```shell
❯ git clone https://github.com/TGRHavoc/live_map-interface.git
# or if you have ssh keys set up
❯ git clone git@github.com:TGRHavoc/live_map-interface.git

> Cloning into 'live_map-interface'...
> remote: Enumerating objects: 8288, done.
> remote: Counting objects: 100% (511/511), done.
> remote: Compressing objects: 100% (350/350), done.
> remote: Total 8288 (delta 199), reused 430 (delta 150), pack-reused 7777
> Receiving objects: 100% (8288/8288), 257.39 MiB | 7.10 MiB/s, done.
> Resolving deltas: 100% (2991/2991), done.```
```

If you're working on a new feature that you want to push to the main repository then, best practice is to create a new branch.
```shell
❯ git checkout -b feature/new-feature
```

## Step 2: Installing Dependencies

In order to work with this repository, you will need a few programs installed.
The main one is Node Package Manager (NPM).
You can find information on their website on how to install NPM: [https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm).

It is recommended that you also install [yarn](https://classic.yarnpkg.com/en/docs/install/) but, not it's not required.

Once npm/yarn is installed you can install the dependencies needed to "build" your code.

```
❯ npm install 
# or if using yarn
❯ yarn install

> yarn install v1.13.0
> [1/4] Resolving packages...
> [2/4] Fetching packages...
> info fsevents@1.2.13: The platform "win32" is incompatible with this module.
> info "fsevents@1.2.13" is an optional dependency and failed compatibility check. Excluding it from installation.
> [3/4] Linking dependencies...
> [4/4] Building fresh packages...
> Done in 108.30s.
```

## Step 3: Edit code

Hopefully the structure of the project isn't too alien.
I've tried to create a directory structure that "makes sense".
For example, the JavaScript files all go in [js/src](https://github.com/TGRHavoc/live_map-interface/tree/master/js) and all the styling files go into [style](https://github.com/TGRHavoc/live_map-interface/tree/master/style).

Some directory names you may come across include:
- `vendor` - Other projects that this project depends on. For example, bootstrap's files.
- `{first,last}_bundle` - This determines where in the HTML page these JS files are loaded.
  - `first_bundle` - Loaded in the "head".
  - `last_bundle` - Loaded after all the other HTML tags.
- `scss` - The SCSS files for styling the interface
- `webfonts` - Fonts used by the interface

### Editing JS files

By default Gulp is configured to file _all_ files ending with `.js` inside `js/src/{first,last}_bundle` and bundle them all together into their corresponding `dist/*.js` file.
For example, if you wanted to add some code to head of the interface, you would create a new JS file inside `js/src/first_bundle` (or another subdirectory if needed) and just run Gulp.

If you wanted to create another directory inside `js/src/` for your files then, make sure to add them to gulp.
For example, if you wanted to create a directory for `some-new-feature` then the modified `gulpfile.js` should included something along the lines of
```js
function pack_some_new_feature() {
    return gulp.src(["js/src/some-new-feature/**/*.js"]) // ALL js files, even ones in subdirectories
        .pipe(concat("some-new-feature.js")) // The file all this code will be placed into
        .pipe(minify({ // Minify the code 
            ext: {
                min: ".js"
            },
            noSource: true
        }))
        .pipe(gulp.dest("dist/")); // Output "some-new-feature.js" to the "dist/" folder
}

exports.default = gulp.series(
    gulp.parallel(
        preprocess_sass,
        preprocess_bootstrap
    ),
    gulp.parallel(pack_js, pack_js_2, pack_css, pack_some_new_feature) // Make sure we run the function we just created
);
```

And obviously make sure to include the new JS file in `index.html`!


### Editing SCSS files

By default Gulp is configured to file _all_ files ending with `.scss` inside `style/scss/src/` and bundle them all together into the `style/src/style.css` file.
The `style/src/style.css` file is the file that is used inside `debug.html` so, it's recommended to always build your SCSS before viewing the debug page.
There's a Gulp task set up called `sass:watch` which, will automatically pick up any changes inside `style/scss/src/` and build them to `style.css`.
You can run this by typing the following:
```shell
❯ npx gulp sass:watch
# or if using yarn
❯ yarn gulp sass:watch
yarn run v1.13.0
$ live_map-interface\node_modules\.bin\gulp sass:watch
[00:06:05] Using gulpfile live_map-interface\gulpfile.js
[00:06:05] Starting 'sass:watch'...
```

## Step 4: Build!

Since you've already installed all the dependencies and what not, this step should be easy.
Just run Gulp!

```
❯ npx gulp
# or if using yarn
❯ yarn gulp
[00:09:16] Using gulpfile live_map-interface\gulpfile.js
[00:09:16] Starting 'default'...
[00:09:16] Starting 'preprocess_sass'...
[00:09:16] Starting 'preprocess_bootstrap'...
[00:09:16] Finished 'preprocess_sass' after 13 ms
[00:09:17] Finished 'preprocess_bootstrap' after 734 ms
[00:09:17] Starting 'pack_js'...
[00:09:17] Starting 'pack_js_2'...
[00:09:17] Starting 'pack_css'...
[00:09:18] Finished 'pack_css' after 915 ms
[00:09:18] Finished 'pack_js_2' after 1 s
[00:09:20] Finished 'pack_js' after 3.19 s
[00:09:20] Finished 'default' after 3.93 s
```
