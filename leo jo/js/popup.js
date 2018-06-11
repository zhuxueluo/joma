
console.log('popup load js')
console.log(chrome.runtime)
var port = null;
// chrome.runtime.onMessage.addListener(
  // function(request, sender, sendResponse) {
     // if (request.type == "launch"){
        // connectToNativeHost(request.message);
    // }
    // return true;
// });
console.log("runtime added Listener")
var btn = document.getElementById("button")
btn.onclick = startNative;

//onNativeDisconnect
function onDisconnected()
{
    console.log(chrome.runtime.lastError);
    console.log('disconnected from native app.');
    port = null;
}

function onNativeMessage(message) {
    console.log('recieved message from native app: ' + JSON.stringify(message));
}

//connect to native host and get the communicatetion port
function connectToNativeHost(msg)
{
    var nativeHostName = "com.leo.test";
    console.log(nativeHostName);
    port = chrome.runtime.connectNative(nativeHostName);
    port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);
    port.postMessage( msg);
 }
 
 
 
function sendmsg() {
  console.log("sendmsg to runtime")
// chrome.runtime.sendMessage({type: "launch", message: "leonative.py"}, function(response) {
  // console.log(response)
  // });
connectToNativeHost("C:\\D\\leonative.py")
};

function startNative(){
console.log('startNative')
sendmsg()
}
function sendConfm(){
    var prodName = ""
    var inputEls = document.getElementsByTagName("input")
    for(var j = 0; j < inputEls.length; j++){
        if(inputEls[j].type=="radio"  && inputEls[j].checked){
            prodName = inputEls[j].getAttribute("prodname")
            break
        }
    }
    sendConfirmToContent(prodName)
}
function sendConfirmToContent(prodName){
    var message = {"type":"jomalone_confirm_prod","data":prodName}
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response)
        {
            //if(callback) callback(response);
        });
    });
}

//-------------------------------real function
// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    console.log('got content-script msg');
    console.log("request="+request);
    console.log("sender="+sender);
    console.log("sendresponse function= "+sendResponse);
    sendResponse('im bg-js, got your msg：' + JSON.stringify(request));
    if(request.msgtype && request.msgtype=="jomalone_products"){
        for(var i=0; i< request.data.length; i++){
            var temp = document.createElement('input');
            temp.setAttribute('type', 'radio');
            temp.setAttribute('name', "prdname")
            temp.setAttribute('id', 'popupid'+i);
            temp.setAttribute('seq', i)
            temp.setAttribute('prodname', request.data[i].product_name)
            var plabel = document.createElement('label');
            plabel.textContent=request.data[i].product_name
            plabel.setAttribute('for', 'popupid'+i)
            var br = document.createElement('br');
            document.getElementById('inputdiv').appendChild(temp);
            document.getElementById('inputdiv').appendChild(plabel);
            document.getElementById('inputdiv').appendChild(br);
        }
        var confm = document.createElement('input')
        confm.setAttribute("type","submit")
        confm.onclick = sendConfm
        document.getElementById('inputdiv').appendChild(confm);
    }
});


function getprodsFunction(e){
    var message = {"type":"getprods","data":""}
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response)
        {
            //if(callback) callback(response);
        });
    });
}

var getprodsBtn = document.getElementById("getprods")
getprodsBtn.onclick = getprodsFunction