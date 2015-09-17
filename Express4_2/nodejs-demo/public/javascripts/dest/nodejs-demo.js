//addLoadEvent 作用： 当html文档准备好时，加载多个函数

function addLoadEvent(func) {
    var oldonload = window.onload;

    if ( typeof window.onload !== 'function' ) { 
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        };
    }
}

//创建XMLHttpRequest对象

function getHttpObject() {
    if ( typeof XMLHttpRequest === 'undefined' ) {
        XMLHttpRequest = function() {
            try {
                // code for IE6, IE5
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch(e) {
            }
        };
    }
    return new XMLHttpRequest();
}

// 获取 index.json 文件的内容

function getJSON() {
    var request = getHttpObject();

    request.open("GET", "javascripts/src/index.json?t=" + Math.random(), true); //可能得到的是缓存的结果,为了避免这种情况，请向 URL 添加一个唯一的 ID
    request.onreadystatechange = function() {
        if( request.status === 200 && request.readyState === 4 ) {  //养成一个好的习惯，使用全等符号，避免强制类型转换造成的错误
            var obj = JSON.parse(request.responseText);
            var persInfo = obj.persInfo; //由于下面会多次使用到这个变量，便将其存储在一个临时变量当中，优点是可以减少输入字符的数量，加快速度，而且还可以减少出错

            // 在圆圈中显示倒数计时的效果, 时间为5秒
            var cnt = 5;
            var t1;
            var countDown = function () {
                document.getElementById("one").innerHTML = String(cnt); // 记得要转换为字符串，我被坑了
                document.getElementById("two").innerHTML = String(cnt);
                cnt--;
                if ( cnt === 0 ) {
                    clearTimeout(t1); // 清除计时器，养成良好的习惯，以防留下什么后患
                    return ;
                }
                t1 = setTimeout(function () {
                    countDown();
                }, 1000);
            };
            countDown();

            // 在JSON内容加载完成之后，倒计时5秒后加入内容，原因是有时候加载内容速度太快了，没有了加载动画的效果，太扫兴了，这个动画可算是我第一次真真正正的使用css3
            var load = document.getElementById("load");
            var bodyElement = document.getElementsByTagName("body")[0]; //后面的方括号一定要记得加，我又被坑了，原因是通过getElementsByTagName得到的是一个类似数组的东西
            var t2  = setTimeout(function () { 
                bodyElement.removeChild(load);
                bodyElement.innerHTML = '<div class="animated"><h1>Self-introduction:</h1><ul><li>Name:  ' + persInfo.name + '</li><li>Sex: ' + persInfo.sex + '<li>Age: ' + persInfo.age + '</li><li>Height: ' + persInfo.height + '</li><li>Weight: ' + persInfo.weight + '</li><li>Job: ' + persInfo.job + '</li></div>';
            
            }, 5000);
        }
    };
    request.send();
}

addLoadEvent(getJSON);
