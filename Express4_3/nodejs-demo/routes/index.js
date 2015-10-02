var express = require('express');
var fs = require('fs');
var path = require('path');
var Promise = require('bluebird');
var marked = require('marked');
var pygmentize = require('pygmentize-bundled');

var router = express.Router();


//从每一个符合规范的文件名中取出相应的部分
function Blog(filename) {
    //其实正则表达式这一步在这个案例中不是必须的，但是多了也无妨，多学点东西。
    var regPattern = /^[0-9]{4}-[0-9]{2}-[0-9]{2}-.{1,}\.md$/;
    if ( filename.search(regPattern) !== -1 ) { 
        var dateYear = filename.slice(0,4);
        var dateMonth = filename.slice(5,7);
        var dateDate = filename.slice(8,10);
        this.title = filename.slice(11, filename.lastIndexOf('.'));
        this.url = '/blog/' + dateYear + '/' + dateMonth + '/' + dateDate + '/' + this.title;
    }
}

router.get('/', function (req, res) {
    res.render('home.html');
});

//在主页面中显示文章列表的链接
router.get('/blog', function (req, res) {
    var html = '';
    var dir = path.join('public', 'blogs');
    var blogList = new Array(); 
    var blogItem;
    var readdir = Promise.promisify(fs.readdir); //使用Promise来处理异步函数的返回结果
    readdir(dir)
        .then(function (files) {
            if ( files && files.length ) {
                files.forEach(function (filename) {
                    blogItem = new Blog(filename);
                    blogList.push(blogItem);
                });
            }
            return blogList;
        })
        .then(function (blogList) {
            if ( blogList && blogList.length ) {
                blogList.forEach(function (blog) {
                    html += '<a href="' + blog.url + '">' + blog.title + '</a><br />';
                    res.send(html);
                });
            } else {
                res.send('No Blogs Found.');
            }
        })
        .catch(function ( e ) {
        });
});


//设置 pygmentize-bundled 来做代码高亮转换
marked.setOptions({
    highlight: function (code, lang, callback) {
        pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
            callback(err, result.toString());
        });
    }
});

//读取每一篇具体的文章并通过marked模块将md文件的内容转变成html文件的内容
router.get('/blog/:year/:month/:day/:title', function(req, res, next) {
    var dir = path.join('public', 'blogs');
    var fileName = req.params.year + '-' + req.params.month + '-' + req.params.day + '-' + req.params.title + '.md';
    fs.readFile(path.join(dir, fileName), 'utf-8', function (err, data) {
        if ( err ) {
            return next(err);
        }
        marked(data, function (err, content) {
            if ( err ) {
                res.send(err);
            }
            res.render('../index.ejs', { data: content });
        });
    });
});

module.exports = router;
