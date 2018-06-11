console.log('this is log from hello_content.js log crx js');
var helpinfo="contentjs is another portal to DOM operation, but be not aware of JS from original DOM. So insert element to inject crx inject js to join the origin JS"
console.log(helpinfo)
function inject(jsPath){
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function()
    {
        console.log("script onload log: rm element")
        // 放在页面不好看，执行完后移除掉。但是此时js已经inject完成
        this.parentNode.removeChild(this);
        
        
         
         
    };
    document.body.appendChild(temp);
}

//receive injected msg
window.addEventListener("message", function(e)
{
    console.log(e.data);
    if(e.data.msgtype && e.data.msgtype=="jomalone_products"){
        chrome.runtime.sendMessage(e.data, function(response) {
        console.log('got response from bg-js：' + response);
});
    }
},
 false);

// receive popupjs msg
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    sendResponse('i got you msg');
    // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
    if(request.type == 'jomalone_confirm_prod' || request.type == 'getprods'){
        window.postMessage(request,'*')// forward to injected-js
    } 
});

inject();



