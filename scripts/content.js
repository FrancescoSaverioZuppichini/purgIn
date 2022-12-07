console.log("heyyyy");



chrome.runtime.onConnect.addListener(function(port) {
    console.log("I am listeningggggg")
    console.assert(port.name === "PURGIN");
   
    port.onMessage.addListener(function (msg) {
        console.log(`Received msg ${msg.type}`)
        switch(msg.type) {
            case "GET_POSTS":
                // fetch posts
                port.postMessage({ type: "GET_POSTS" })
                break;
             default:
                 console.error("boom")
        }
    });
  });