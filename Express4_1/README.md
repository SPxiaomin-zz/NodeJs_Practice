# Express4.13.1 练习实战（8/27/2015）

## Description: 

> 此次练习来自于<http://blog.fens.me/nodejs-express3/>, 这个教程中是`express3.x`版本的，通过不断的google和看官方文档，终于解决了。
>
> 主要内容：
>
>> 此教程讲解了如何通过Express框架和Bootstrap框架完成一个简单的登入登出网站。
>
> 借助资源：
>
>> - <https://www.npmjs.com/package/>, 在这个网站中我能找到我目前需要的所有模块。
>> - <http://expressjs.com/4x/api.html>, 这个是Express官方网站，在这里可以找到你需要的api, 我目前还没有全部看完， 不过应该就快了。
>> - 其他还有一些零零碎碎的知识来自于 StackOverflow, Segmentfault 等网站

## Knowledge Point：

> - 首先，安装express库。在Express3.6.x之前的版本，Express需要全局安装的，项目构建器模块是合并在Express项目中的，后来这个构建器被拆分出来，独立成为了一个项目express-generator，现在我们只需要全局安装express-generator项目就行了。
>
>           npm install -g express-generator@4  #-g参数，意思是全局安装
>
> - 安装好express-generator包后，我们在命令行就可以使用express命令了。
>
>           express -V  #检查版本号
>
> - 通过`express -e nodejs-demo`创建项目。
>
> - 接下来设置模板引擎, 使得`ejs`可以解析`html`后缀的文件：
>
>> 1. 在app.js文件顶部引入ejs：
>>
>>          ejs = require('ejs');
>>
>> 2. 注册模板引擎(有两总方式）：
>>
>>          app.engine('html', ejs.__express);
>>          or
>>          app.engine('html', ejs.renderFile);
>>
>> 3. 设置默认引擎后缀：
>>
>>          app.set('view engine', 'html');
>>
>> 4. 现在就可以使用`html`后缀的视图文件了。
>
> - 这个教程当中涉及到了Bootstrap框架的使用，如果要使用的话可以通过CDN或者将文件下载到本地，这个教程中提及到了使用`bower`管理工具将Bootstrap包下载到本地，喜欢折腾的我果断学习了一下这个对于我陌生的工具：
>
>> 1. 通过`npm`下载bower:
>>          
>>          npm install -g bower #我的学习环境是Ubuntu15.04, 所以需要超级用户权限才能进行安装。同时还要注意添加`-g`参数，进行全局安装，这样才可以当成命令使用。
>>
>> 2. 初始化bower.json文件：
>>
>>          bower init
>>
>> 3. 通过bower下载Bootstrap到public目录之下:
>>
>>          bower install bootstrap --save
>>
>> 4. 接着你就可以在文件中引入了。
>
> - 紧接着分离视图文件: `header.html`, ... , `footer.html`。
>
> - 设计路由:
>
>> 1. 访问路径：/，页面：index.html，不需要登陆，可以直接访问。
>>
>> 2. 访问路径：/home，页面：home.html，必须用户登陆后，才可以访问。
>>
>> 3. 访问路径：/login，页面：login.html，登陆页面，用户名密码输入正确，自动跳转到home.html
>>
>> 4. 访问路径：/logout，页面：无，退出登陆后，自动回到index.html页面
>
> - 编写视图文件,主要用到了Bootstrap中的按钮，Alerts(警告), 表单。
>
> - Session的使用（使用到了[connect-mongo](https://www.npmjs.com/package/connect-mongo)和[express-session](https://www.npmjs.com/package/express-session)模块）：
>
>> 1. 在app.js文件顶部引两个模块:
>>
>>          session = require('express-session');
>>          MongoStore = require('connect-mongo')(session);
>>
>> 2. 在application中使用(目前我也只会简单的使用，有很多的设置还不是很懂，还有待进一步的学习):
>>
>>          app.use(session({
>>              resave: ture,
>>              saveUninitialized: ture,
>>              secret: 'secret',
>>              store: new MongoStore({
>>                  db: 'nodejsdemo'
>>              })
>>          }));
>>
>> 3. 现在就可以使用了，其中还涉及到了`res.locals`的使用，这是一个亮点。
>
> - 最后一步就是进行页面访问控制了：
>
>> 1. / ，谁访问都行，没有任何控制
>>
>> 2. /login，用all拦截所有访问/login的请求，先调用notAuthentication，用户登陆检查
>>
>> 3. /logout，用get拦截访问/login的请求，先调用Authentication，用户不登陆检查
>>
>> 4. /home，用get拦截访问/home的请求，先调用Authentication，用户登陆检查
>

#Summary:

> 到这一步就已经大功告成了，只想说一句，太爽了！加油！
