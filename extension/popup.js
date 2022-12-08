const APP_NAME = "PURGIN";

const wordInput = document.querySelector("#wordInput")
const wordAddBtn = document.querySelector("#wordAddBtn")
const wordList = document.querySelector("#wordList")

// https://developer.chrome.com/docs/extensions/mv3/messaging/


class WordsStorage {
    getWords() {
        return chrome.storage.local.get([APP_NAME]).then(result => {
            if (result[APP_NAME] === undefined) result[APP_NAME] = "[]"
            return JSON.parse(result[APP_NAME])
        })
    }

    addWord(word) {
        return this.getWords().then(words => {
            let set = new Set()
            if (words !== undefined) {
                set = new Set(words)
            }
            const wasAlreadyThere = set.has(word)
            set.add(word)
            return chrome.storage.local.set({ "PURGIN": JSON.stringify(Array.from(set)) }).then(() => wasAlreadyThere)
        })
    }

    deleteWord(word) {
        return this.getWords().then(words => {
            let set = new Set(words)
            set.delete(word)
            return chrome.storage.local.set({ "PURGIN": JSON.stringify(Array.from(set)) })
        })
    }
}


const wordsStorage = new WordsStorage()


function removeBtnHandler(e, word, row) {
    wordsStorage.deleteWord(word).then(() => {
        console.log(`Deleted ${word}`)
        row.parentNode.removeChild(row)
    })
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



async function wordAddBtnHandler(e) {
    const word = wordInput.value
    if (word === undefined || word == "" || !word) return
    wordsStorage.addWord(word)
        .then(wasAlreadyThere => {
            if (!wasAlreadyThere) addWordToList(word)
            wordInput.value = ""

        })

}

wordsStorage.getWords()
    .then(words => {
        for (let word of words) {
            addWordToList(word)
        }
        wordAddBtn.addEventListener("click", wordAddBtnHandler)
        chrome.storage.onChanged.addListener((changes, namespace) => {
            for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
                if (key !== APP_NAME) return
                const words = JSON.parse(newValue)
                console.log(
                    `Storage key "${key}" in namespace "${namespace}" changed.`,
                    `Old value was "${oldValue}", new value is "${newValue}".`
                );
            }
        });
    })
    // .then(() => wordsStorage.getWords())
    // .then(words => console.log(words))
    // .then(() => wordsStorage.setWord("hey"))
    // .then(() => wordsStorage.getWords())
    // .then(words => console.log(words))



