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

Since moving over to Webpack this process has gotten a whole lot easier.
All you have to do now, is create a JS file for your code, make sure it's included somewhere (`import {YourComponent} from "./yourfile"`) and voila!

If you want to see your changes in real-time you can run `yarn dev` (or `npm run dev`) to start the webpack development server.

Building this into the bundled script file is as easy as `yarn build` (or `npm run build`)!
This will do some magic and place the files needed to run LiveMap in the `dist/` folder.


### Editing SCSS files

This should be fairly straight forward with webpack as well.
Create your SCSS file (e.g. `src/sass/myStyle.scss`).
Make sure it's included in the main scss file (`src/sass/main.scss`) by importing it `@import "./myStyle";`.

You should now be done.

Webpack will transform this into CSS and pop it into the JavaScript bundle, loading the style when the JS is loaded.
Again, to see your changes in real-time make sure you have the webpack development server running (`yarn dev` or `npm run dev`).



## Step 4: Build!

Since you've already installed all the dependencies and what not, this step should be easy.
Just run the build script!

```
❯ npm run build
# or if using yarn
❯ yarn build
 yarn run v1.22.17
$ webpack build
assets by status 3.34 KiB [cached] 3 assets
assets by status 739 KiB [emitted]
  asset livemap.e39bf3ab164133c7ac48.js 722 KiB [emitted] [immutable] [minimized] [big] (name: index) 2 related assets
  asset ../index.html 8.46 KiB [emitted] [compared for emit]
  asset index.html 8.41 KiB [emitted]
orphan modules 86.4 KiB [orphan] 15 modules
runtime modules 2.39 KiB 7 modules
cacheable modules 1.1 MiB (javascript) 3.34 KiB (asset)
  modules by path ./ 1.1 MiB (javascript) 3.34 KiB (asset)
    javascript modules 1.1 MiB
      modules by path ./node_modules/ 559 KiB 14 modules
      modules by path ./src/ 566 KiB
        ./src/js/_app.js + 14 modules 87.4 KiB [built] [code generated]
        ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/sass/main.scss 479 KiB [built] [code generated]
    asset modules 126 bytes (javascript) 3.34 KiB (asset)
      ./node_modules/leaflet/dist/images/layers.png 42 bytes (javascript) 696 bytes (asset) [built] [code generated]
      ./node_modules/leaflet/dist/images/layers-2x.png 42 bytes (javascript) 1.23 KiB (asset) [built] [code generated]
      ./node_modules/leaflet/dist/images/marker-icon.png 42 bytes (javascript) 1.43 KiB (asset) [built] [code generated]
  modules by path data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/ 4.39 KiB 16 modules

WARNING in webpack performance recommendations: 
You can limit the size of your bundles by using import() or require.ensure to lazy load some parts of your application.
For more info visit https://webpack.js.org/guides/code-splitting/

webpack 5.64.1 compiled with 14 warnings in 7914 ms
Done in 8.90s.

```
