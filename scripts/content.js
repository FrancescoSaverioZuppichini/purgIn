let postsIdTONodes = {}
let newPostId = 0

function handleGetPosts() {
    const postsNodes = document.querySelectorAll("div.scaffold-finite-scroll__content > div")
    let posts = []
    for (let node of postsNodes) {
        try {
            posts.push({ "text": node.querySelector("span.break-words > span").textContent, "id": newPostId })
            postsIdTONodes[newPostId] = node
            newPostId++
        } catch (TypeError) {
            console.log("bad node!")
        }
    }
    return posts
}

function handleDeletePosts(posts) {
    for (let post of posts) {
        const { id } = post
        const node = postsIdTONodes[id]
        node.parentNode.removeChild(node)
        delete postsIdTONodes[id]
    }
}

var port = chrome.runtime.connect({ name: "PURGIN" });
port.postMessage({ type: "CONNECTION" })


port.onMessage.addListener(function (msg) {
    console.log(`Received msg ${msg.type}`)
    console.table(msg.data)
    switch (msg.type) {
        case "GET_POSTS":
            const posts = handleGetPosts()
            // fetch posts
            port.postMessage({ type: "GET_POSTS_TO_DELETE", data: posts })
            break;
        case "DELETE_POSTS":
            handleDeletePosts(msg.data)
            break;
        default:
            console.error("Boom")
    }
});

window.addEventListener("scroll", () => port.postMessage({ type: "CONNECTION" }))

// setInterval(() => port.postMessage({ type: "CONNECTION" }), 1000)