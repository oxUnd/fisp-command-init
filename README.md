## 脚手架使用文档

### 介绍
如果你使用的是FIS，如果你感觉有一些东西可以做成规范实行起来，如果你有一些公用的模板或者组件的框架，那么就使用脚手架吧。方便快捷简单的搞定上面提到的这些问题。

### 使用方法

#### 基本用法
```bash
$ fis init -h

  Usage: init [options] [command]

  Commands:

    module                 create a module
    widget                 create a widget

  Options:

    -h, --help                 output usage information
    -s, --scaffold <scaffold>
    -d, --dir <name>           create to dir
    --with-plugin              if create a module, whether include `plugin`
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
.
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
FIS提供了包组件管理平台lights，你可以方便的把包发不到lights上；
脚手架内核提供了从lights下载包的方法；

```javascript
/**
 * options.exclude [RegExp]需要排除的文件
 * options.include [RegExp]需要的文件
 * dist 目标目录
 */
fis.scaffold.downlaod('组件名', dist, options, callback);
```

###### 制作插件

插件需要放到npm上，插件命名规范`fis-scaffold-<插件名>`。

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