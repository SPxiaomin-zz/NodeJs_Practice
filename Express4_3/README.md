# node.js 和 express4.x 写一个自己的博客网站（网站建设中）

## Knowledge Points

### Node.js

#### API

- path.join([path1][, path2][, ...])

    作用：
    
    连接所有的参数，并且根据操作系统的不同规范化得到的路径。
    
    注意：
    
    参数必须是字符串。
    
    上面是主要的东西，如果需要更加详细的内容，请参见 [官方API网站](https://nodejs.org/api/path.html#path_path_join_path1_path2);
    
- fs.readdir(path, callback)

    作用：
    
    **异步** 读取目录的内容。`callback` 函数接受两个参数 `err` 、`files`，其中 `files` 是一个包含文件名的数组，但是不包括 `.` 和 `..`。
    
    上面差不多就是 [官方API网站](https://nodejs.org/api/fs.html#fs_fs_readdir_path_callback) 所讲的东西，可以自己查看官网阅读英文原版，锻炼一下自己的英文阅读水平。
    
- fs.readFile(filename[, options], callback)

    作用：
    
    **异步** 读取一个文件中全部的内容。`callback` 函数接受两个参数 `err`、`data`，data是文件中的内容。如果未在 `options` 部分设置编码的话，默认是返回原始缓冲区中的内容。如果 `options` 部分传递的是一个字符串，则设置的是编码方式。
    
    还有些地方我目前还没有用到，所以也无法解释清楚，请原谅：），如果需要的话，请点击 -> [官方API网站](https://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback)。
    
#### 使用回调函数返回值

这是我第一次使用回调函数来返回值。首先当我访问主页的时候，页面上一直没有文章列表，我一直没有弄明白错在哪里，我就仔细的检查代码，后面发现怎么 `blogList` 的值在 `getBlogList()` 函数中没有返回，我突然猛地发现 `fs.readdir` 是个异步函数，后面竟然通过Google之后，在 [CNode 社区](https://cnodejs.org/topic/54ae4b73ce87bace2444ccf7) 找到了一样的问题。

下面是解决问题之后的实现代码:

    // routes/index.js
    function getBlogList(dir, callback) {
        var blogList = new Array(); 
        var blogItem;
        fs.readdir(dir, function (err, files) {
            if ( files && files.length ) {
                files.forEach(function (filename) {
                    blogItem = new Blog(filename);
                    blogList.push(blogItem);
                });
            }
            callback(null, blogList);
        });
    }
    
    router.get('/', function (req, res) {
        var html = '';
        getBlogList(path.join('public','blogs'), function (err, blogList) {
            if ( blogList && blogList.length ) {
                blogList.forEach(function (blog) {
                    html += '<a href="' + blog.url + '">' + blog.title + '</a><br />';
                });
                res.send(html);
            } else {
                res.send('No Blogs Found.');
            }
        });
    });
    
后面我学习了一下 `Promise`，将 `routes/index.js` 中的回调函数实现改成了 `bluebird` 提供的 `Promise` 实现方法来重写了，但是这个东西本人第一次学习，暂时半桶水，简单的讲解下怎么用吧，也就是先用具有回调函数的函数名初始化一个 `Promise` 对象，然后通过这个 `Promise` 对象来处理回调函数做的事情，产生类似 `jQuery` 的链式方法，`then` 处理成功的结果，`catch` 处理错误的结果。原理占时无法解释清楚，还是不误导人了，提供给你们一些资料吧：）-> [Cnode 社区](https://cnodejs.org/topic/556caa9b638127f01f74dde0) ， [廖雪峰老师的教程](http://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/0014345008539155e93fc16046d4bb7854943814c4f9dc2000)。

#### 缓冲区模块

第一次接触这个模块，懵懵懂懂的感觉，以下的内容是我从 <<Node.js 入门\>\> 这本书中摘录下来的内容。

Node.js 中的缓冲区是处理二进制数据的一种方式。由于 Javascript 语言不能很好处理二进制数据，所以缓冲区实际上是对原始内存的分配，以便 Node.js 对此读写数据。这就让 Node.js 可以以健全的方式来处理二进制数据，而不必依赖在二进制数据的处理方面有所不足的 Javascript 语言。

缓冲区是 Buffer 类的实例，由于 Buffer 模块是全局的，所以无需请求该模块即可使用。依据实例化的方式不同，缓冲区有许多选项。它们可以用一个代表要分配给缓冲区的字符数（或者八位位组数）的整型值作为参数。也可指定要使用的编码。默认编码是 UTF-8，所以如果不指定编码的话，使用的将是 UTF-8。

如果将其作为字符串写到控制台，那么它将展示的是一个 UTF-8 字符串。Node.js 提供 `toString()`方法将缓冲区以字符串方式写出。

#### 流模块

如果是使用 UNIX 类型操作系统的朋友应该非常的熟悉流的概念，就是数据流的输入输出。

如果缓冲区是 Node.js 处理原始数据的方式的话，那么流通常是 Node.js 移动数据的方式。Node.js 的流可以是可读的和/或是可写的。

第一次接触有点懵懵懂懂的感觉，那就让我们一起看个例子吧：

    var fs = require('fs');
    
    var readableStream = fs.ReadStream('in.txt'); // 可读流
    
    var writableStream = fs.WriteStream('out.txt'); // 可写流
    
    readableStream.pipe(writableStream); // 通过 pipe() 方法来自动的处理暂停流和恢复流操作，所以除非需要对事件的发生有完全的控制，否则应该使用 pipe()。可以通过事件模块，控制对流的处理，如果需要的，自己 Google 吧，下面那也有简单的介绍。

#### 事件模块

`Events` 模块实际上很简单，只要理解了事件的发送和侦听，就可以很容易的理解其工作方式了。

先看个简单的例子吧：

    var EventEmitter = require('events').EventEmitter;
    var ee = new EventEmitter();
    
    ee.emit('message', 'this emits a message');
    
    ee.on('message', function (data) {
        console.log(data);
    });
    
    这个例子发射了一个名为 `message` 的事件，并传递了一个字符串参数。然后侦听器接受到了这个事件之后，将传递过来的参数打印在控制台上。

上面例子的实现步骤：

1. 创建一个新的 `EventEmitter` 实例
    
        var EventEmitter = require('events').EventEmitter;
        var ee = new EventEmitter();

2. 发射事件

        ee.emit('message', 'this emits a message');
        
    第一个参数是一个对事件进行描述的字符串，以便用于与侦听器匹配。可以使用任何的字符串。除了第一个标签字符串之外，还可以添加一个字符串作为第二个参数，在收到事件时这些参数将会被传递到侦听器中。
    
3. 侦听事件

        ee.on('message', function (data) {
            console.log(data);
        });

既然可以创建事件，当然可以移除事件：

    ee.removeListener('message', function (data) {
        console.log(data);
    });


#### marked & pygmentize-bundled 模块的使用

这两个模块是结合起来组成高亮代码工具，是第二次使用这个东西了，但是第一次使用的使用纯粹就是照葫芦画瓢，一点都没有理解，随着时间的推移并且每天不断的学习，终于对于 `node` 有了一定的掌握（虽然还不是很多，但是我会不停的学习，进步），如果想真真正正的掌握两个模块还需要不断的学习，所以说我目前仍然是个半桶水，下面介绍的都是一些我已经算掌握了的东西，没掌握的就暂时不写出来了，免得误导人。

安装的话使用 `npm` 工具，不过推荐使用 `cnpm` 工具，速度快过了，[CNode 社区](https://cnodejs.org/topic/5338c5db7cbade005b023c98) 的大牛写了一篇介绍的文章，不过又查到说有个新工具 `smart-npm`，暂时有更重要的事情，就不去管他了。 

    sudo cnpm install --save marked pygmentize-bundled  // 记得加 --save 参数，将依赖写入 package.json 文件。我用的是 ubuntu15.04，所以需要使用超级用户权限。

- marked

    这个模块的代码放在 [github上](https://github.com/chjj/marked)，以下的内容就是摘至于github上的md文件。
    
    作用：
    
    将 `md` 文件内容转换成 `html` 文件内容。

    API:
    
    marked(markdownString [,options] [,callback])
    
    - markdownString
    
        这个是传入的需要被解析的md文件内容。
    
    - options
    
        这是你需要设置的选项。由于目前默认的选项就可以满足我的要求，所以我没有去改动。
    
        这个参数可以省略，通过 `marked.setOptions` 这个接口来实现的设置，传入的是一个对象。
    
        `highlight` 函数就可以通过这种方式来设置：
        
            var marked = require('marked');

            var markdownString = '```js\n console.log("hello"); \n```';
            
            // Async highlighting with pygmentize-bundled
            marked.setOptions({
              highlight: function (code, lang, callback) {
                require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
                  callback(err, result.toString());
                });
              }
            });
            
            // Using async version of marked
            marked(markdownString, function (err, content) {
              if (err) throw err;
              console.log(content);
            });
            
        `highlight` 函数的参数：
        
        - code
        
            传递给高亮程序的代码，这个参数是由 `marked` 模块自动填充的。
        
        - lang
        
            这是传入代码使用的语言实现方式，也是由 `marked` 模块自动填充的。
        
        - callback
        
            这个参数其实就是下面的 `callback`，在 [`pygmentize-bundled`](https://www.npmjs.com/package/pygmentize-bundled#options) 模块异步处理完成之后，就调用这个回调函数返回结果。
    
    - callback
    
        这个是当使用异步的 `highlight` 函数的时候调用的回调函数。
        
- pygmentize-bundled

    这个模块也放在github上面，不过总感觉写的md文件看的不顺眼，提供 [npm 上的说明文件](https://www.npmjs.com/package/pygmentize-bundled#options)，好看多了。
    
    使用的话，就是结合上面的 `marked` 模块一起使用，具体的实现代码在上面已经展示。
    
    API:
    
    pygmentize(options, code, callback)
    
    - options
    
        这个是需要设置的选项内容，以对象的方式传递。
        
        这其中最重要的两个选项参数是：
        
        1. lang
        
            这个参数声明的是传递的代码是那种语言实现的，从而采用的语法解析程序。
            
        2. format
        
            这个参数声明的是将传递的代码转换成什么样的文件内容。比如：`html`。
    
    - code
    
        需要高亮的 **字符串** 形式的代码。
    
    - callback
    
        高亮完成时候调用的回调函数。回调函数传入两个参数：
        
        1. err
        
            错误参数，没有什么好解释的。
            
        2. result
        
            高亮之后的结果，这个就得好好的注意一下了，因为返回的不是通常的字符串结果，返回的是一个 `Buffer` 对象，所以需要使用 `toString()` 方法将其转换为  `utf-8` 字符串的形式。对于 `Buffer` ，在上面有一些简单的介绍。
            
### Pygments 

简要介绍：

这是一个使用python写的语法高亮器，之所以会在这里介绍的原因是因为在上面使用 `pygmentize-bundled` 插件的之后，需要使用相关的 `css` 文件，所以我就学习了一下。

这个工具我是第一次使用，看了一下它的 [官网](http://pygments.org/docs/cmdline/) 部分内容，学习了一下命令行使用工具说明，感觉有些东西还没有达到那个等级，只掌握了我现在能够掌握的部分，同时这里还有一篇写的不错的 [文章](http://jerryzou.com/posts/usePygments/)，以下内容的话，摘录于上面的两个网站：

1. 安装

    我使用的是 Ubuntu15.04，相关命令如下，其他的操作系统的话，参见上面那篇文章吧。
    
        sudo apt-get install python-pygments

2. 使用这个工具来生成响应的 `css` 文件

        pygmentize -f html -a .highlight -S monokai > style.css
    
    参数说明：
    
    -f: 指定生成的文件类型。这里生成 `css` 文件，由于参数设定的值是 `html`。
    
    -a: 为 `css` 文件中所有的选择器添加一个祖先选择器 `.highlight`。
    
    -S: 指定你喜欢的一种风格。风格的种类的话，在上面的那篇文章中有介绍，官网也有。
    
    这里使用到了命令行中的数据流重定向符号 `>`，将内容输出到 `style.css` 文件中。
    

### Express

#### API

- req.params

    作用：
    
    这是一个包含路径中对应命名参数作为属性值的对象，这个对象的默认值是 `{}`。简单的说，如果你有一个路径 `/route/:name`，那么这个 `name` 可以通过 `req.paras.name` 取得。
    
    这只介绍了本教程中使用到了的部分，如需更详细的内容，给你个 [官网API](http://expressjs.com/4x/api.html#req.params)。
    

### Bower

这是我第二次使用这个工具了，目前使用的直观感受就是：

1. 可以脱机工作。
2. 不需要让我去找什么依赖什么的，节省了很多的时间。

[segmentfault](http://segmentfault.com/a/1190000000349555) 上有一篇介绍 `Bower` 的文章，讲得挺好的，入门级别，质量个人认为非常的高。以下是一些从其中摘录下来的内容。

1. 安装

    使用一个工具的第一件事情肯定是知道如何去安装，让我这只小菜鸟来教教你吧！
    
        sudo npm install -g bower // 记得要加上全局 -g 参数，以便能够将这个工具当命令使用。
        
2. 了解这个工具的使用

    输入如下的命令获得参数帮助文档。
    
        bower help
    
3. 使用这个工具来安装包

    由于我现在打算使用 `Bootstrap#3.3.5` 来做一个响应式的博客，所以需要下载安装响应的包，如果自己去下载的话，虽说现在什么都比较方便了，但使用 `bower` 这个东东还是更加方便快捷的。
    
    安装 bootstrap#3.3.5
    
        bower install bootstrap#3.3.5 --save //记得要加 --save 参数，将这个依赖加入 bower.json 文件中
        
    注意事项：
    
    1. 可以通过 '#' 号后面跟相应的版本号来下载你想要的版本。
    
    2. 记住不需要加 `sudo`，否则会报错 -> 
    
    `bower ESUDO         Cannot be run with sudo`
    
其实用到这里就差不多了，如果还需要更加详细的内容的话，自行 Google 吧，上面给的那篇文章其实也一般情况下够用了。

### Bootstrap#3.3.5


### gulp 自动化工具

前段时间学习了以下 `Grunt` 工具，感觉还不错。但是后面看到了一篇文章，其中涉及到了 `gulp` 这个工具的使用，于是我学了以下。得出了一个结论学习了 `Grunt` 这个工具后，入手 `gulp` 很快。但是说真的，看到的很多文章都已经过时了，还是看 [官网API文档](https://github.com/gulpjs/gulp/blob/master/docs/API.md) 的介绍比较好。

简要的介绍一下使用到的 API:

- gulp.task(name[, deps], fn)

    使用样例：
    
        gulp.task('somename', function() {
          // Do stuff
        });

    参数简介：
    
    - name: 
    
        指定任务的名字。
        
        注意事项：
        
        如果你需要在命令行中使用到的话，不要在名字中有空格。
        
    - deps:
    
        类型：数组。
        
        这个参数是可选的。目的是为了在执行这个任务之前，执行一些其它的依赖任务。
        
    - fn:
    
        执行任务操作的函数。
    
- gulp.watch(glob [, opts], tasks) or gulp.watch(glob [, opts, cb])

    这两个 API 接口的作用都是观测文件内容，当文件内容发生变化的时候做一些事情。

    - gulp.watch(glob [, opts], tasks)
    
        使用示例：
        
            var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
            watcher.on('change', function(event) {
              console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
            });
        
        上面的这个示例中涉及到了事件模块侦听的知识，在上面的部分我做了一下简单的介绍，足以理解这里的使用例子。
        
        参数简介：
        
        - glob:
        
            类型： 字符串 或者 数组。
            
            指定需要匹配的文件。
            
            在这里简单的介绍一下我最常用到的东西：
            
                ['js/**/*.js', '!js/test.js']
            
            上面涉及到了常用的三个东西：
            
            1. `**` 
            
                这个符号的作用是包括任意的字符，与 `*` 区分开来，后者不包括目录符号。
                
                也就是说 `js/**/*.js` 的话可以匹配 `js/test/test.js`，而 `js/*.js` 不能匹配，只能匹配 `js/test.js`。
                
            2. `!`
            
                这个符号表示不包括某个文件，也就是排除在外。
                
        - opts 
        
            这个参数我也没有用过，就暂时不介绍了，需要的话，去官网吧。
        
        - tasks
        
            类型： 数组
            
            指定当文件内容发生变动的时候，一系列要运行的任务（由 `gulp.task` 指定的）。
            
    - gulp.watch(glob [, opts], cb)
    
        使用示例：
        
            gulp.watch('js/**/*.js', function(event) {
                console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
            });
    
        参数简介：
        
        前两个参数同上。
        
        - cb
        
            类型：函数
            
            其实就是一个回调函数，传入了一个对象 `event`，这个参数包含如下的属性：
            
            1. `event.type`
            
                类型：字符串
                
                这个属性值代表的是文件内容改变的类型：`added`, `changed` 或者 `deleted`。                     
            
            2. `event.path`
            
                类型：字符串
                
                触发事件文件所在的绝对路径。

- gulp.src(globs[, options])

    读取匹配文件中的内容，然后通过 `pipe` 管道传输到可写流当中去，这就涉及到流模块的知识了，上面部分有简单的介绍。
    
    参数简介：
    
    - globs
    
        这个参数在上面已经介绍过了，不重复了。
        
    options 参数部分就是介绍一个 options.base
    
    类型： 字符串
    
    默认的值： 匹配模式开始的前面部分，可能有点难以理解，看看下面的示例代码吧：
        
        gulp.src('client/js/**/*.js') // Matches 'client/js/somedir/somefile.js' and resolves `base` to `client/js/`
          .pipe(minify())
          .pipe(gulp.dest('build'));  // Writes 'build/somedir/somefile.js'
        
        gulp.src('client/js/**/*.js', { base: 'client' })
          .pipe(minify())
          .pipe(gulp.dest('build'));  // Writes 'build/js/somedir/somefile.js'

    
- gulp.dest(path[, options])

    指定文件的被写路径。
    
    参数简介：
    
    - path
    
        类型：字符串（还有其他的一种，暂时用不到，不介绍了）
        
        这个路径是将 `gulp.src` 中的 `base` 的除外的值加到 `path` 值末尾生成的。
        
    options 参数部分我就不介绍了，我目前还没有达到那个看懂的等级，如果需要的话，自己去看API吧。
    
    
### gulp 插件

- gulp-watch

    检测文件内容是否变化，进而执行一些任务。
    
    详细的使用说明请参见上面介绍的 `gulp API`。

- gulp-less

    由于使用到了 `less` 来简化编写 `css` 代码，所以需要使用这个插件来进行编译。这个插件的在 [npm 插件网站](https://www.npmjs.com/package/gulp-less/) 上面有详细的使用说明，这个插件的默认设置就已经够用了，如果需要的话，自己去官网转悠吧：）。
    
    使用示例：
    
        var less = require('gulp-less');
        
        gulp.task('tastName', function () {
            return gulp.src('public/less/*.less')
                .pipe(less())    // 这里会自动的将文件的后缀名变成 .css
                .pipe(gulp.dest('public/stylesheets/'));
        });
    
- gulp-minify-css

    这个插件用来压缩 `css` 代码。默认配置暂时够用。提供一下 [插件的github网址](https://github.com/murphydanger/gulp-minify-css)。
    
    使用示例：
    
        var less = require('gulp-less'),
            minifyCSS = require('gulp-minify-css');
        
        gulp.task('tastName', function () {
            return gulp.src('public/less/*.less')
                .pipe(less())    // 这里会自动的将文件的后缀名变成 .css
                .pipe(gulp.dest('public/stylesheets/'))
                .pipe(minifyCSS()),
                .pipe(rename({
                    extname: ".min.css"
                })
                .pipe(gulp.dest('public/stylesheets/'));
        });
        
- gulp-rename

    这个插件是用来重命名文件的。[npm 插件网站](https://www.npmjs.com/package/gulp-rename) 上提供了三种方式，我这里介绍一下第三种：
    
        // rename via hash 
        gulp.src("./src/main/text/hello.txt", { base: process.cwd() })
          .pipe(rename({
            dirname: "main/text/ciao",
            basename: "aloha",
            prefix: "bonjour-",
            suffix: "-hola",
            extname: ".md"
          }))
          .pipe(gulp.dest("./dist")); // ./dist/main/text/ciao/bonjour-aloha-hola.md 
    
    对象参数简介：
    
    - dirname 
    
        这个参数默认就是 `gulp.src` 方法中将 `base` 除外的值，详细说明看上面。
        
    - basename
    
        文件名（不包括扩展名）
        
    - prefix
    
        文件名前缀
        
    - suffix 
    
        文件名后缀
        
    - extname
    
        文件的扩张名
    
- gulp.livereload

    这个插件实现在改动了代码的情况下，自动刷新浏览器的界面，不过要与 `Chrome` 的 `livereload` 插件一块使用。[npm 插件网站上](https://www.npmjs.com/package/gulp-livereload/) 介绍了一大串的东西，我觉得我只需要用到示例中的东西就差不多足够了。
    
        var gulp = require('gulp'),
            less = require('gulp-less'),
            livereload = require('gulp-livereload');
         
        gulp.task('less', function() {
          gulp.src('less/*.less')
            .pipe(less())
            .pipe(gulp.dest('css'))
            .pipe(livereload());
        });
         
        gulp.task('watch', function() {
          livereload.listen();
          gulp.watch('less/*.less', ['less']);
        });
    
- gulp.plumber

    这个插件防止在 `gulp` 插件发生错误的时候，停止使用 `gulp`。[npm 插件网站](https://www.npmjs.com/package/gulp-plumber/) 上介绍了原理，以及使用说明，我又想说同样的一句话，我暂时用不到选项参数当中的东西，暂时就不介绍了。
    
    注意事项：
    
    一定要在使用这个插件的时候，放在最前面。举个例子吧：
    
        var plumber = require('gulp-plumber');
        var coffee = require('gulp-coffee');
         
        gulp.src('./src/*.ext')
            .pipe(plumber())
            .pipe(coffee())
            .pipe(gulp.dest('./dist')); 

- gulp-imagemin

    对图片进行压缩。[npm 插件网站](https://www.npmjs.com/package/gulp-imagemin/) 上面一大堆的选项，表示看不懂是什么东西。我选的都是默认的设置。
    
        gulp.task('images', function () {
            return gulp.src('src/images/*')
                .pipe(imagemin())
                .pipe(gulp.dest('dist/images'));
        });
    
毫不吝啬的给你们看一下我写的 `gulpfile.js` 文件，小小的自恋一下，这个文件结合了很多人的写法，应该很优化了：

    var gulp = require('gulp'),
        watch = require('gulp-watch'),
        livereload = require('gulp-livereload'),
        plumber = require('gulp-plumber'),
        rename = require('gulp-rename'),
        imagemin = require('gulp-imagemin'),
        less = require('gulp-less'),
        minifyCSS = require('gulp-minify-css');
    
    var paths = {
        html: ['views/**/*.html'],
        less: ['public/less/**/*.less'],
        images: ['public/images/src/**/*']
    };
    
    var watcherHtml;
    var watcherLess;
    var watcherImage;
    
    gulp.task('html', function () {
        return gulp.src(paths.html)
            .pipe(livereload());
    });
    
    gulp.task('images', function () {
        return gulp.src(paths.images)
            .pipe(plumber())
            .pipe(imagemin())
            .pipe(plumber.stop())
            .pipe(gulp.dest('public/images/dest'));
            .pipe(livereload());
    });
    
    gulp.task('styles', function () {
        return gulp.src(paths.less)
            .pipe(plumber())
            .pipe(less())
            .pipe(plumber.stop())
            .pipe(gulp.dest('public/stylesheets'))
            .pipe(minifyCSS())
            .pipe(rename({
                extname: ".min.css"
            }))
            .pipe(gulp.dest('public/stylesheets'))
            .pipe(livereload());
    });
    
    gulp.task('default', ['html', 'styles', 'images'], function () {
        livereload.listen();
    
        watcherHtml = gulp.watch(paths.html, ['html']);
        watcherHtml.on('change', function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    
    
        watcherLess = gulp.watch(paths.less, ['styles']);
        watcherLess.on('change', function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    
        watcherImage = gulp.watch(paths.images, ['images']);
        watcherImage.on('change', function (event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    });

    
    
### LESS




### Javascript

#### RegExp类型

`ECMAScript` 通过 `RegExp` 类型来支持正则表达式。使用下面的语法，就可以创建一个正则表达式。

    var expression = / pattern / flags ;
    
其中的模式（pattern）部分可以是任何简单或复杂的正则表达式，可以包含字符类、限定符、分组、向前查找以及反向引用。每个正则表达式都可带有一或多个标志（flags），用以标明正则表达式的行为。

还有一种创建正则表达式的方式是 `RegExp` 构造函数。由于它接受的两个参数都是字符串，所以在某些情况下要对字符串进行双重转义，有点复杂，这里就不展开介绍了。一般情况下使用字面量形式来定义正则表达式足以。

之所以要在这里提到这种方法的原因是因为在我读取目录，生成 `url` 的时候，可以采用到这种方法来实现，具体的实现有两种比较好的方法，有些兼容性不太好的方法，我就没介绍了，具体实现在下面介绍。

- 专为捕获组设计的 `exec()` 方法

    `exec()` 接受一个参数，既要应用模式的字符串，然后返回包含 **第一个匹配项**(即使是在模式设置了全局标志 `g` ，它每次也只会返回一个匹配项，只有在多次调用才会在字符串中继续查找新匹配项) 消息的数组；或者在没有匹配的情况下返回 `null`。在数组中，第一项是与整个模式匹配的字符串，其他项是与模式中的捕获组匹配的字符串（如果模式中没有捕获组，则该数组只包含一项--与模式匹配的字符串）。
    
        var pattern = /^([0-9]{4})-([0-9]{2})-([0-9]{2})-(.{1,})\.md$/;
        
        var filename = '2015-09-20-test.md';
        
        var matches = pattern.exec(filename);
        
        console.log(matches);  //  ["2015-09-20-test.md", "2015", "09", "20", "test"]

- 测试是否与参数匹配的 `test()` 方法 & `RegExp` 构造函数属性

    `test()` 方法也接受一个字符串参数，在模式与该参数匹配的情况下返回 `true`；否则，返回 `false`。

    `RegExp` 构造函数包含一些属性（这些属性在其他语言中被看成是静态属性）。这些属性适用于作用域中的所有正则表达式，并且基于所执行的最近一次正则表达式操作而变化。`js` 中有多大9个用于存储捕获组的构造函数属性。访问这些属性的语法是 `RegExp.$1` 、`RegExp.$2` ... `RegExp.$9`，分别用于存储第一，第二......第九个匹配的捕获组。在调用 `exec` 或 `test` 方法时，这些属性会被自动填充。
    
    
        var pattern = /^([0-9]{4})-([0-9]{2})-([0-9]{2})-(.{1,})\.md$/;
        
        var filename = '2015-09-20-test.md';
        
        if ( pattern.test(filename) ) {
        
            console.log(RegExp.$1); // 2015
            
            console.log(RegExp.$2); // 09
            
            console.log(RegExp.$3); // 20
            
            console.log(RegExp.$4); // test
        }
    

#### String类型

- 字符串操作方法 `slice()`

        var stringValue = "hello world";
        alert(stringValue.slice(3, 7));  //"lo w"

    方法详解：
    
    这个方法返回被操作字符串的一个子字符串，接受一或两个参数：
    
    1. 第一个参数指定字符串的开始位置
    2. 第二个参数（在指定的情况下）表示子字符串最后一个字符后面的位置
    
    在传递的参数是负值的情况下，`slice()` 方法会将传入的负值与字符串的长度相加。
    其实还有另外的两种方法 `substring()` 和 `substr`，但是这两个方法有些地方有点坑，所以我就不详细介绍了。个人认为，如果有很多的方法可以达到同样的效果，在一般的情况下，精通一种最好的，了解其他的，在需要的时候再来查找，如果多次用到的话，就 '解决' 他吧。如果精力和时间充沛就都精通吧，多学点东西不会有害处！
    
- 字符的模式匹配方法

    1. `match()` 方法
    
        这个方法就不详细的介绍了，本质上与调用 `RegExp` 的 `exec()` 方法相同。唯一的区别就是模式和文本的位置调换了。
        
    2. `search()` 方法
    
        这个方法的唯一参数与 `match()` 方法的参数相同：由字符串或 `RegExp` 对象指定的一个正则表达式。`search()` 方法返回字符串中第一个匹配项的索引；如果没有找到匹配项，则返回-1。而且，`search()` 方法始终是从字符串开头向后查找模式。
        具体的实现代码请参见 `routes/index.js` 文件。
    
- 字符串的位置方法 `indexOf()` `lastIndexOf()`

        var stringValue = "hello world";
        alert(stringValue.indexOf('o', 6));        // 7
        alert(stringValue.lastIndexOf('o', 6));    // 4

    方法详解：
    
    这两个方法是从字符串中查找子字符串的方法，然后返回子字符串的位置（如果没有找到该子字符串，则返回-1）。
    
    区别：
    
    1. `indexOf()` 方法从字符串的开头向后搜索子字符串
    2. `lastIndexOf()` 方法从字符串的末尾向前搜索子字符串
    
    这两个方法都可以接收可选的第二个参数，表示从字符串的哪个位置开始搜索(这个位置包括在内)。
    
#### Array 类型

定义数组的方式：

1. var array = [];
2. var array = new Array();

但是其中有许多要注意的细节，这里就不一一介绍了，自己看红皮书吧。

- 迭代方法

    `ECMAScript5` 为数组定义了5个迭代方法。每个方法都接受两个参数：要在每一项上运行的函数和（可选的）运行该函数的作用域对象--影响 `this` 的值。传入这些方法中的函数会接受三个参数：数组项的值、该项在数组中的位置和数组对象本身。
    
    由于这里只使用到了 `forEach` 方法，我就只展开介绍这一种。其它就自行看红皮书吧。
    
    `forEach()` 对数组中的每一项运行给定的函数。这个方法没有返回值，本质上与使用 `for` 循环迭代数组一样。
    
