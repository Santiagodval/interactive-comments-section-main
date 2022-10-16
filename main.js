var storage = localStorage;
storage.length === 0 ? new Promise(resolve => {
    setTimeout(() => {
      resolve(starter());
    }, 500);
}) : 
    new Promise(resolve => {
    setTimeout(() => {
      resolve(generateHTML());
    }, 500);
});

const starter = () => {
    fetch('./data.json')
        .then((response) => response.json())
        .then((json) => {
            //sets the comments key of the local storage to the json parameters
            storage.setItem("comments", JSON.stringify(json));            
            console.log(json);
            //logs the object in the comments key
            console.log(JSON.parse(storage.getItem('comments')));
        });
}

const generateHTML = () => {
    let chatSection = document.getElementById("comments");

    chatSection.innerHTML = "";

    console.log("genero HTML")

    JSON.parse(storage.comments).comments.forEach(element => {
        chatSection.innerHTML = chatSection.innerHTML + `<section class='comment' 
        id="${element.id}">
        <section class='commentHeader'>
            <div class='commentData'>
                <img src=${element.user.image.png}>
                <h4 class='name'>${element.user.username}</h4>
                <p>${element.createdAt}</p>
            </div>

        </section>

        <div class='buttons'>
                ${JSON.parse(storage.comments).currentUser.username === element.user.username ? `<button id="delete${element.id}" class="delete"><img src="images/icon-delete.svg">Delete</button>` : ""}
                <button id="reply${element.id}" class='reply'>
                    <img src='images/icon-reply.svg'>
                    Reply
                </button>
            
            </div>

        <div class='scoreCounter'>
                <button class='add'><img src='images/icon-plus.svg'></button>
                ${element.score}
                <button class='minus'><img src='images/icon-minus.svg'></button>
            </div>
        
        <section class='commentTextSection'>
            <p class='commentTextContent'>${element.content}</p>
        </section>

        <div class='responses'>
            ${generateResponses(element.replies)}
        </div>
        </section>
        `;
        });

    chatSection.innerHTML = chatSection.innerHTML +` 
        <section class="textEntry">
        <input id='textfieldEntry' placeholder='Add a comment...' type='textfield'></input>
        <div class='textEntryUserThings'>
        <img src='${JSON.parse(storage.comments).currentUser.image.png}'></img>
        <button class='sendButton' id='sendButton'>Send</button>
        </div>
        </section>
    `
    document.getElementById("sendButton").addEventListener("click", addComment);
    createListeners();
    
    //    console.log(chatSection.innerHTML);
}

const generateResponses = (replies) => {

    let string = "";
    replies.forEach(element => {

        string = string + `
        <div id=${element.id} class='response'>
        <section class='commentHeader'>
            <div class='commentData'>
                <img src=${element.user.image.png}>
                <h4 class='name'>${element.user.username}</h4>
                ${JSON.parse(storage.comments).currentUser.username === element.user.username ? '<p class="youTag">you</p>' : ""}
                <p>${element.createdAt}</p>
            </div>

        </section>

        <div class='buttons'>
                ${JSON.parse(storage.comments).currentUser.username === element.user.username ? `<button id="delete${element.id}" class="delete"><img src="images/icon-delete.svg">Delete</button>` : ""}

                <button id="reply${element.id}" class='reply'>
                    <img src='images/icon-reply.svg'>
                    Reply
                </button>
            
            </div>

        <div class='scoreCounter'>
                <button class='add'><img src='images/icon-plus.svg'></button>
                ${element.score}
                <button class='minus'><img src='images/icon-minus.svg'></button>
            </div>

        <section class='commentTextSection'>
            <p class='commentTextContent'><strong>@${element.replyingTo} </strong>${element.content}</p>
        </section>
        </div>
    `
        
})

    return string;
    
}

const addComment = () => {

    console.log(storage);

    var parsedStorage = JSON.parse(storage.comments);
    var existingComments = parsedStorage.comments;
    parsedStorage.meta.commentNumber = parsedStorage.meta.commentNumber +1; 

    existingComments.push({
        id:JSON.parse(storage.comments).meta.commentNumber + 1,
        content: document.getElementById("textfieldEntry").value,
        createdAt:"seconds ago",
        score: 0,
        user : {
           image: {
                png: JSON.parse(storage.comments).currentUser.image.png,
                webp: JSON.parse(storage.comments).currentUser.image.webp
           },
           username: JSON.parse(storage.comments).currentUser.username     
        },
        replies: []
    })

    parsedStorage.comments = existingComments;

    storage.setItem("comments", JSON.stringify(parsedStorage));

    generateHTML();
}

const createListeners = () => {
    JSON.parse(storage.comments).comments.forEach(element => {
        if(element.replies.length){
            element.replies.forEach(element2 => {
                document.getElementById(`delete${element2.id}`) ? document.getElementById(`delete${element2.id}`).addEventListener("click", deleteComment) : null;
                document.getElementById(`reply${element2.id}`) ? document.getElementById(`reply${element2.id}`).addEventListener("click", replyComment) : null;
            })
        }
        console.log(document.getElementById(`delete${element.id}`))
        document.getElementById(`delete${element.id}`) ? document.getElementById(`delete${element.id}`).addEventListener("click", deleteComment) : null;
        document.getElementById(`reply${element.id}`) ? document.getElementById(`reply${element.id}`).addEventListener("click", replyComment) : null;
    })
}

const deleteComment = (e) => {
    let i = 0;
    parsedStorage = JSON.parse(storage.comments)
    parsedStorage.comments.forEach(element => {
        "delete" + element.id === e.target.id ? parsedStorage.comments.splice(i,1) : null;
        if(element.replies.length){
            let r = 0;
            console.log(parsedStorage.comments[i].replies)
            element.replies.forEach(element2 => {
                "delete"+element2.id === e.target.id ? parsedStorage.comments[i].replies.splice(r,1) : null;
                r++;
            })
            
        }
        i++;
    });

    storage.setItem("comments", JSON.stringify(parsedStorage));
    generateHTML();
    
}

const replyComment = (e) => {
    console.log(e.target.id);
}
