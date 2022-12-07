console.log("heyyyy")

const wordInput = document.querySelector("#wordInput")
const wordAddBtn = document.querySelector("#wordAddBtn")
const wordList = document.querySelector("#wordList")

// https://developer.chrome.com/docs/extensions/mv3/messaging/

function filterPosts(posts) {
    console.log(posts)
}


(async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    console.log(tab)

    var port = chrome.tabs.connect(tab.id, { name: "PURGIN" });

    port.postMessage({ type: "GET_POSTS" })

    port.onMessage.addListener(function (msg) {
        console.log(`Received msg ${msg.type}`)
        switch(msg.type) {
            case "GET_POSTS":
                // faccio filtering
                break;
             default:
                 console.error("boom")
        }
    });

})();


function addWord(word) {
    // add word to db
    // add word to dom
    createListItem(word)
}

function removeWord(word) {
    // add word from db
    // add word from dom
}

function removeBtnHandler(e, word, row) {
    row.parentNode.removeChild(row)
}

function addWordToList(word) {
    let li = document.createElement("li")
    let text = document.createElement("p")
    text.innerHTML = word
    let removeBtn = document.createElement("button")
    removeBtn.innerHTML = "Delete"
    removeBtn.addEventListener("click", (e) => removeBtnHandler(e, word, li))
    li.appendChild(text)
    li.appendChild(removeBtn)
    wordList.appendChild(li)
}



function wordAddBtnHandler(e) {
    const word = wordInput.value
    if (word === undefined || word == "" || !word) return
    addWordToList(word)
    wordInput.value = ""

}

wordAddBtn.addEventListener("click", wordAddBtnHandler)
addWordToList("hello")
