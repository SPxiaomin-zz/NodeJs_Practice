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
