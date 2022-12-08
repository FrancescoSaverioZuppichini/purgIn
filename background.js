const APP_NAME = "PURGIN";


class WordsStorage {
    getWords() {
        return chrome.storage.local.get([APP_NAME]).then(result => JSON.parse(result[APP_NAME]))
    }
}

const wordsStorage = new WordsStorage()


function doesContainWord(word, text) {
    console.log(text, word)
    return text.match(new RegExp(word, 'mgi')) !== null
}

function handleGetPostsToDelete(posts) {
    // get the words from local storage
    // check if posts contains that word
    // return back the post to delete
    let postsToRemove = []
    return wordsStorage.getWords()
        .then((words) => {
            if (words === undefined) return []
            for (let post of posts) {
                for (let word of words) {
                    if (doesContainWord(word, post.text)) {
                        postsToRemove.push({ ...post, ... { reason: word } })
                        break
                    }
                }
            }
            return postsToRemove
        })
}

chrome.runtime.onConnect.addListener(function (port) {
    console.log("Listening")
    console.assert(port.name === APP_NAME);

    port.onMessage.addListener(function (msg) {
        console.log(`Received msg ${msg.type}`)
        console.table(msg.data)
        switch (msg.type) {
            case "CONNECTION":
                port.postMessage({ type: "GET_POSTS" })
                break;
            case "GET_POSTS_TO_DELETE":
                handleGetPostsToDelete(msg.data)
                    .then((posts) => port.postMessage({ type: "DELETE_POSTS", data: posts }))
                break;
            default:
                console.error("Boom")
        }
    });
});