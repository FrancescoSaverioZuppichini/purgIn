console.log("heyyyy");

(async () => {
    const response = await chrome.runtime.sendMessage({ type: "GET_POSTS"});
    // do something with response here, not outside the function
    console.log(response);
  })();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
        console.log("Received", request.type)
        switch(request.type) {
            case "GET_POSTS":
                sendResponse({ type: "GET_POSTS", data: [] })
                break;
            default:
                console.error("boom")
            
        }
    }
  );

  var port = chrome.runtime.connect({name: "knockknock"});
port.postMessage({joke: "Knock knock"});
port.onMessage.addListener(function(msg) {
  if (msg.question === "Who's there?")
    port.postMessage({answer: "Madame"});
  else if (msg.question === "Madame who?")
    port.postMessage({answer: "Madame... Bovary"});
});