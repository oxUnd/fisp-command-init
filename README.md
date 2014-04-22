## 脚手架使用文档

### 介绍
如果你使用的是FIS，如果你感觉有一些东西可以做成规范实行起来，如果你有一些公用的模板或者组件的框架，那么就使用脚手架吧。方便快捷简单的搞定上面提到的这些问题。

### 使用方法

#### 基本用法

```bash
$ fis init -h
  Usage: init <command> [options]

  Commands:

    module                 create a module
    widget                 create a widget

  Options:

    -h, --help                 output usage information
    -s, --scaffold <scaffold>
    -d, --dir <name>           create to dir
    --with-plugin              if create a module, whether include `plugin`
    --repos <url>              repository
```

如上，脚手架支持创建一个模块（module）和widget（widget），其使用方法是；

##### 新建module
```
$ fis init module -d  common --with-plugin // common只是一个文件夹，可以是任何目录
or
$ fis init module -d no-common // no-common只是一个文件夹，可以是任何目录
```
##### 新建widget

```
$ fis init widget -d header
```

##### 非常棒的一个功能

如果你的项目用了未在FIS中默认依赖的插件，比如sass，比如某某某；

当一个新人拿到这样一个模块时，需要安装这些插件，但如果没有文档说明这些，TA最多看到release时的一个报错，然后不知所措；

脚手架支持这样一个功能，自动安装这些插件。

在模块目录下执行；
```bash
$ fis init
```

#### 高级用法
这节主要说一下脚手架的定制，脚手架默认附带一份模板和插件，后面会具体说明`模板`和`插件`。

##### 模板

模板就是已经被创建好的module和widget；里面体现了公用的编码规范，和一些可替换的全局变量；这块很重要，是整个脚手架的核心。
这个模板里面可以说明：

+ js组件如何导出函数
+ js组件如何使用，使用规范是什么
+ 注释如何写
+ css组件如何写
+ fis-conf.js公用的配置
+ 其他

有了模板，还需要有一些不一样的地方，就比如注释里面的作者、时间；还有fis-conf.js里面的namespace等。这种修改怎么办，脚手架提供一种方法。
当制作模板的时候使用`{{- namespace -}}`这种方式后，再进行创建的时候需要使用者输入`namespace`的值。

###### 插件
插件是用来进行一些目录调整的、文件名替换、下载模板等；

##### 详细步骤
+ 制作模板
    + module模板
    + widget模板
    + 全局变量
+ 发布模板
+ 制作插件
+ 发布插件


###### 制作模板

####### module模板

假设module中包含

+ fis-conf.js          // fis配置文件
+ page/layout.tpl      // layout.tpl
+ page/index.tpl       // 页面模板
+ plugin/*             // 插件
+ test/page/index.php  // index页面测试数据
* widget/header.tpl    // widget tpl模板
* widget/header.css    // widget css文件
* widget/header.js     // widget js文件

那就创建这些文件，并完善；

```bash
$ tree iknow-scaffold-module
iknow-scaffold-module
    ├── fis-conf.js
    ├── page
    │   ├── index.tpl
    │   └── layout.tpl
    ├── plugin
    └── widget
        └── header
            ├── header.css
            ├── header.js
            └── header.tpl
```


####### widget模板

widget模板中包含
+ widget.tpl
+ widget.js
+ widget.css

####### 全局变量

比如 fis-conf.js

```javascript
fis.config.set('namespace', {{-namespace ?-}});
```

以上说明了以下模板的制作过程，更详细请安装已经设定好的模板作为参考

```bash
$ lights install pc-scaffold-module
```
###### 发布模板

FIS提供了包组件管理平台lights，你可以方便的把包发布到lights上；

```bash
$ cd iknow-scaffold-module
$ lights init //要求安装lights
...
$ lights publish
```
done.

脚手架内核提供了从lights下载包的方法；

```javascript
/**
 * options.exclude [RegExp]需要排除的文件
 * options.include [RegExp]需要的文件
 * dist 目标目录
 */
fis.scaffold.downlaod('组件名', dist, options, callback);
```
下载完成以后，需要呼出交互界面替换全局变量的接口；

```javascript
/**
 * dir 下载组件存放的文件夹
 */
fis.scaffold.prompt(dir);
```
还提供了一个mv接口，用来做文件或文件夹移动的；

```javascript
fis.scaffold.mv(from, to, include, exclude);
```

其他接口；

还可以使用`fis.util`里面的所有方法；

```javascript
$ node
> fis = require('fis');
> fis.util
{ [Function]
  is: [Function],
  map: [Function],
  pad: [Function],
  merge: [Function],
  clone: [Function],
  escapeReg: [Function],
  escapeShellCmd: [Function],
  escapeShellArg: [Function],
  stringQuote: [Function],
  getMimeType: [Function],
  exists: [Function],
  fs:
   { Stats: [Function],
     exists: [Function],
     existsSync: [Function],
     readFile: [Function],
     readFileSync: [Function],
     close: [Function],
     closeSync: [Function],
     open: [Function],
     openSync: [Function],
     read: [Function],
     readSync: [Function],
     write: [Function],
     writeSync: [Function],
     rename: [Function],
     renameSync: [Function],
     truncate: [Function],
     truncateSync: [Function],
     ftruncate: [Function],
     ftruncateSync: [Function],
     rmdir: [Function],
     rmdirSync: [Function],
     fdatasync: [Function],
     fdatasyncSync: [Function],
     fsync: [Function],
     fsyncSync: [Function],
     mkdir: [Function],
     mkdirSync: [Function],
     readdir: [Function],
     readdirSync: [Function],
     fstat: [Function],
     lstat: [Function],
     stat: [Function],
     fstatSync: [Function],
     lstatSync: [Function],
     statSync: [Function],
     readlink: [Function],
     readlinkSync: [Function],
     symlink: [Function],
     symlinkSync: [Function],
     link: [Function],
     linkSync: [Function],
     unlink: [Function],
     unlinkSync: [Function],
     fchmod: [Function],
     fchmodSync: [Function],
     lchmod: [Function],
     lchmodSync: [Function],
     chmod: [Function],
     chmodSync: [Function],
     lchown: [Function],
     lchownSync: [Function],
     fchown: [Function],
     fchownSync: [Function],
     chown: [Function],
     chownSync: [Function],
     _toUnixTimestamp: [Function: toUnixTimestamp],
     utimes: [Function],
     utimesSync: [Function],
     futimes: [Function],
     futimesSync: [Function],
     writeFile: [Function],
     writeFileSync: [Function],
     appendFile: [Function],
     appendFileSync: [Function],
     watch: [Function],
     watchFile: [Function],
     unwatchFile: [Function],
     realpathSync: [Function: realpathSync],
     realpath: [Function: realpath],
     createReadStream: [Function],
     ReadStream: { [Function: ReadStream] super_: [Object] },
     FileReadStream: { [Function: ReadStream] super_: [Object] },
     createWriteStream: [Function],
     WriteStream: { [Function: WriteStream] super_: [Object] },
     FileWriteStream: { [Function: WriteStream] super_: [Object] },
     SyncWriteStream: { [Function: SyncWriteStream] super_: [Object] } },
  realpath: [Function],
  realpathSafe: [Function],
  isAbsolute: [Function],
  isFile: [Function],
  isDir: [Function],
  mtime: [Function],
  touch: [Function],
  isWin: [Function],
  isTextFile: [Function],
  isImageFile: [Function],
  md5: [Function],
  base64: [Function],
  mkdir: [Function],
  toEncoding: [Function],
  isUtf8: [Function],
  readBuffer: [Function],
  read: [Function],
  write: [Function],
  filter: [Function],
  find: [Function],
  del: [Function],
  copy: [Function],
  ext: [Function],
  query: [Function],
  pathinfo: [Function],
  camelcase: [Function],
  pipe: [Function],
  parseUrl: [Function],
  download: [Function],
  upload: [Function],
  install: [Function],
  readJSON: [Function],
  glob: [Function],
  nohup: [Function],
  normalize: [Circular] }
```

###### 制作插件

插件需要放到npm上，插件命名规范`fis-scaffold-<插件名>`。具体可参考[fis-scaffold-pc](https://github.com/xiangshouding/fis-scaffold-pc)

插件接口:

```javascript
/**
 * options
 * options.dir  安装到dir目录下
 * options.withPlugin 是否带插件
 */
module.exports = function (options) {
  ...
  //必须导出widget和module两个接口
  return {
    widget: function () {....}
    module: function () {....}
  };
}

```

插件完成后发布npm；

那么这个插件如何使用呢；假设自定义了一个插件`fis-scaffold-iknow`.

那么使用的时候

```bash
# 使用-s选择某个脚手架
$ fis init module -s iknow -d common
$ fis init widget -s iknow -d footer
```

###### 发布插件

```bash
$ npm publish
```