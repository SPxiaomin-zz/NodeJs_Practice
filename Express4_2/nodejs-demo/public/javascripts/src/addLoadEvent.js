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
