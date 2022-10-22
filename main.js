var storage = localStorage;
storage.getItem("comments") ? new Promise(resolve => {
    setTimeout(() => {
      resolve(starter());
    }, 500);
}) : 
    new Promise(resolve => {
    setTimeout(() => {
      resolve(generateHTML());
    }, 500);
});
//TENÉS QUE HACER RELOAD PARA QUE CARGUE EL HTML CUANDO ELIMINAS EL ALMACENAMIENTO


const starter = () => {
    fetch('./data.json')
        .then((response) => response.json())
        .then((json) => {
            console.log("fetcheo")
            //sets the comments key of the local storage to the json parameters
            storage.setItem("comments", JSON.stringify(json));  
            //logs the object in the comments key
            generateHTML();
        });
}

const generateHTML = () => {
    let chatSection = document.getElementById("comments");

    chatSection.innerHTML = "";


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
                ${JSON.parse(storage.comments).currentUser.username === element.user.username ? `<button id="delete${element.id}" class="delete"><img src="images/icon-delete.svg">Delete</button><button id="edit${element.id}" class="edit"><img src="images/icon-edit.svg">Edit</button>` : ""}
                <button id="reply${element.id}" class='reply'>
                    <img src='images/icon-reply.svg'>
                    Reply
                </button>
            
            </div>

        <div class='scoreCounter'>
                <button class='add' id="add${element.id}"><img src='images/icon-plus.svg'></button>
                ${element.score}
                <button class='minus' id="minus${element.id}"><img src='images/icon-minus.svg'></button>
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
    removeListeners();
    createListeners();
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
                ${JSON.parse(storage.comments).currentUser.username === element.user.username ? `<button id="delete${element.id}" class="delete"><img src="images/icon-delete.svg">Delete</button><button id="edit${element.id}" class="edit"><img src="images/icon-edit.svg">Edit</button>` : ""}

                <button id="reply${element.id}" class='reply'>
                    <img src='images/icon-reply.svg'>
                    Reply
                </button>
            
            </div>

        <div class='scoreCounter'>
                <button class='add' id="add${element.id}"><img src='images/icon-plus.svg' ></button>
                ${element.score}
                <button class='minus' id="minus${element.id}"><img src='images/icon-minus.svg'></button>
            </div>

        <section class='commentTextSection'>
            <p class='commentTextContent'><strong>@${element.replyingTo} </strong>${element.content}</p>
        </section>
        <div class='responses'>
            ${generateResponses(element.replies)}
        </div>
        </div>
    `
        
})

    return string;
    
}

const addComment = () => {


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
                 document.getElementById(`edit${element2.id}`) ? document.getElementById(`edit${element2.id}`).addEventListener("click", editComment) : null;

                 document.getElementById(`minus${element2.id}`) ? document.getElementById(`minus${element2.id}`).addEventListener("click", minusComment) : null;
                 document.getElementById(`add${element2.id}`) ? document.getElementById(`add${element2.id}`).addEventListener("click", addScoreComment) : null;




                element2.replies.length ? createListeners2(element2) : null;
            })
        }
        document.getElementById(`delete${element.id}`) ? document.getElementById(`delete${element.id}`).addEventListener("click", deleteComment) : null;
        document.getElementById(`reply${element.id}`) ? document.getElementById(`reply${element.id}`).addEventListener("click", replyComment) : null;
        document.getElementById(`edit${element.id}`) ? document.getElementById(`edit${element.id}`).addEventListener("click", editComment) : null;

        document.getElementById(`minus${element.id}`) ? document.getElementById(`minus${element.id}`).addEventListener("click", minusComment) : null;
        document.getElementById(`add${element.id}`) ? document.getElementById(`add${element.id}`).addEventListener("click", addScoreComment) : null;

    })
}

const createListeners2 = (element) =>{
    document.getElementById(`delete${element.id}`) ? document.getElementById(`delete${element.id}`).addEventListener("click", deleteComment) : null;
    document.getElementById(`reply${element.id}`) ? document.getElementById(`reply${element.id}`).addEventListener("click", replyComment) : null;
    document.getElementById(`edit${element.id}`) ? document.getElementById(`edit${element.id}`).addEventListener("click", editComment) : null;

    document.getElementById(`minus${element.id}`) ? document.getElementById(`minus${element.id}`).addEventListener("click", minusComment) : null;
    document.getElementById(`add${element.id}`) ? document.getElementById(`add${element.id}`).addEventListener("click", addScoreComment) : null;


    element.replies.forEach(element2 =>{
        document.getElementById(`delete${element2.id}`) ? document.getElementById(`delete${element2.id}`).addEventListener("click", deleteComment) : null;
        document.getElementById(`reply${element2.id}`) ? document.getElementById(`reply${element2.id}`).addEventListener("click", replyComment) : null;
        document.getElementById(`edit${element2.id}`) ? document.getElementById(`edit${element2.id}`).addEventListener("click", editComment) : null;

        document.getElementById(`minus${element2.id}`) ? document.getElementById(`minus${element2.id}`).addEventListener("click", minusComment) : null;
        document.getElementById(`add${element2.id}`) ? document.getElementById(`add${element2.id}`).addEventListener("click", addScoreComment) : null;

        element2.replies.length ? createListeners2(element2) : null;
    })
}

const removeListeners = () => {
    JSON.parse(storage.comments).comments.forEach(element => {
        if(element.replies.length){
            element.replies.forEach(element2 => {
                
                 document.getElementById(`delete${element2.id}`) ? document.getElementById(`delete${element2.id}`).removeEventListener("click", deleteComment) : null;
                 document.getElementById(`reply${element2.id}`) ? document.getElementById(`reply${element2.id}`).removeEventListener("click", replyComment) : null;
                 document.getElementById(`edit${element2.id}`) ? document.getElementById(`edit${element2.id}`).removeEventListener("click", editComment) : null;

                 document.getElementById(`minus${element2.id}`) ? document.getElementById(`minus${element2.id}`).removeEventListener("click", minusComment) : null;
                 document.getElementById(`add${element2.id}`) ? document.getElementById(`add${element2.id}`).removeEventListener("click", addScoreComment) : null;

                element2.replies.length ? removeListeners2(element2) : null;
            })
        }
        document.getElementById(`delete${element.id}`) ? document.getElementById(`delete${element.id}`).removeEventListener("click", deleteComment) : null;
        document.getElementById(`reply${element.id}`) ? document.getElementById(`reply${element.id}`).removeEventListener("click", replyComment) : null;
        document.getElementById(`edit${element.id}`) ? document.getElementById(`edit${element.id}`).removeEventListener("click", editComment) : null;

        document.getElementById(`minus${element.id}`) ? document.getElementById(`minus${element.id}`).removeEventListener("click", minusComment) : null;
        document.getElementById(`add${element.id}`) ? document.getElementById(`add${element.id}`).removeEventListener("click", addScoreComment) : null;
    })
}

const removeListeners2 = (element) =>{
    document.getElementById(`delete${element.id}`) ? document.getElementById(`delete${element.id}`).removeEventListener("click", deleteComment) : null;
    document.getElementById(`reply${element.id}`) ? document.getElementById(`reply${element.id}`).removeEventListener("click", replyComment) : null;
    document.getElementById(`edit${element.id}`) ? document.getElementById(`edit${element.id}`).removeEventListener("click", editComment) : null;

    document.getElementById(`minus${element.id}`) ? document.getElementById(`minus${element.id}`).removeEventListener("click", minusComment) : null;
    document.getElementById(`add${element.id}`) ? document.getElementById(`add${element.id}`).removeEventListener("click", addScoreComment) : null;

    element.replies.forEach(element2 =>{
        document.getElementById(`delete${element2.id}`) ? document.getElementById(`delete${element2.id}`).removeEventListener("click", deleteComment) : null;
        document.getElementById(`reply${element2.id}`) ? document.getElementById(`reply${element2.id}`).removeEventListener("click", replyComment) : null;
        document.getElementById(`edit${element2.id}`) ? document.getElementById(`edit${element2.id}`).removeEventListener("click", editComment) : null;

        document.getElementById(`minus${element2.id}`) ? document.getElementById(`minus${element2.id}`).removeEventListener("click", minusComment) : null;
        document.getElementById(`add${element2.id}`) ? document.getElementById(`add${element2.id}`).removeEventListener("click", addScoreComment) : null;
        
        element2.replies.length ? removeListeners2(element2) : null;
    })
}

//delete comments code
const deleteComment = (e) => {
    
    let parsedStorage = JSON.parse(storage.comments);

    let id = parseInt(e.currentTarget.id.slice(6));

    parsedStorage.comments.forEach((element, i) => {
        element.id === id ? parsedStorage.comments.splice(i,1) : null;

        element.replies.length > 0 ? deleteResponses(parsedStorage.comments[i].replies, id) : null;
    })

    storage.setItem("comments", JSON.stringify(parsedStorage));
    generateHTML();
    
}

const deleteResponses = (parsedStorage, id) =>{
    i=0;
    parsedStorage.forEach((element, i) => {
        element.id === id ? parsedStorage.splice(i,1) : null;
        element.replies.length > 0 ? deleteResponses(parsedStorage[i].replies, id) : null;
    })
}

//edit comments code, bug in the id 4 commentary for some reason

const editComment = (e) => {
    let parsedStorage = JSON.parse(storage.comments);

    let id = parseInt(e.currentTarget.id.slice(4));

    parsedStorage.comments.forEach((element, i) => {
        element.id === id ? editCommentDOM(id, parsedStorage.comments[i], parsedStorage) : null;

        element.replies.length > 0 ? editReplies(parsedStorage.comments[i].replies, id, parsedStorage) : null;
    })

}

const editReplies = (parsedStorage , id, eps) =>{
    i = 0;

    parsedStorage.forEach((element, i) => {
        element.id === id ? editCommentDOM(id, parsedStorage[i], eps) : null;
        element.replies.length > 0 ? editReplies(parsedStorage[i].replies, id, eps) : null;
    })
}

const editCommentDOM = (id, parsedStorage, eps) => {
    let comment = document.getElementById(id);

    let newHTML = `
    <section class="textEntry Replay">
        <input id='textfieldEntry${id}' value='${parsedStorage.content}' type='textfield'></input>
        <div class='textEntryUserThings'>
        <img src='${JSON.parse(storage.comments).currentUser.image.png}'></img>
        <button class='sendButton' id='sendButton${id}'>Send</button>
        </div>
    </section>
    `;

    comment.innerHTML = newHTML;

    document.getElementById("sendButton"+id).addEventListener("click", () => {
        parsedStorage.content = document.getElementById(`textfieldEntry${id}`).value;
        storage.setItem("comments", JSON.stringify(eps));

        generateHTML();
    });
}
//score code

const minusComment = (e) => {
    let id = parseInt(e.currentTarget.id.slice(5));
    parsedStorage = JSON.parse(storage.comments);

    parsedStorage.comments.forEach((element, i) => {
        element.id === id ? element.score-- : null;
        
        element.replies.length > 0 ? minusComment2(parsedStorage.comments[i].replies, id) : null;
    })    

    storage.setItem("comments", JSON.stringify(parsedStorage));

    generateHTML();    
}

const minusComment2 = (parsedStorage, id) => {
    parsedStorage.forEach((element, i) => {
        element.id === id ? element.score-- : null;

        element.replies.length ? minusComment2(parsedStorage[i].replies, id) : null;
    })
}


const addScoreComment = (e) => {
    let id = parseInt(e.currentTarget.id.slice(3));
    
    parsedStorage = JSON.parse(storage.comments);

    parsedStorage.comments.forEach((element, i) => {
        element.id === id ? element.score++ : null;
        
        element.replies.length > 0 ? addScoreComment2(parsedStorage.comments[i].replies, id) : null;
    })    

    storage.setItem("comments", JSON.stringify(parsedStorage));

    generateHTML();    
}

const addScoreComment2 = (parsedStorage, id) => {
    
    parsedStorage.forEach((element, i) => {
        element.id === id ? element.score++ : null;

        element.replies.length ? addScoreComment2(parsedStorage[i].replies, id) : null;
    })
}

//reply comments code
const replyComment = (e) => {
    let id = e.currentTarget.id.slice(5);
    
    addReplyEdit(id);
}

const replyComment2 = (element, i, e) => {

    let r;
    element.replies.length ? element.replies.forEach(element2 => {
        i++;
        "reply" + element2.id === e.currentTarget.id ? r = i : null;
        element2.replies.length ? r = replyComment2(element2, i, e) : null;
    }) : null;

    return r;
}

const addReplyEdit = (id) => {
    document.getElementById(id).innerHTML = document.getElementById(id).innerHTML +` 
        <section class="textEntry Replay">
        <input id='textfieldEntry${id}' placeholder='Add a comment...' type='textfield'></input>
        <div class='textEntryUserThings'>
        <img src='${JSON.parse(storage.comments).currentUser.image.png}'></img>
        <button class='sendButton' id='sendButton${id}'>Send</button>
        </div>
        </section>
        `;

    document.getElementById("sendButton"+id).addEventListener("click", addReply);
}

const addReply = (e) => {
    let parsedStorage = JSON.parse(localStorage.comments);

    id = parseInt(e.currentTarget.id.slice(10));

    parsedStorage.comments.forEach((element,i) => {
        element.id === id+1 ? parsedStorage.comments[i].replies.push({
            id:JSON.parse(storage.comments).meta.commentNumber + 1,
            content: document.getElementById(`textfieldEntry${id}`).value,
            createdAt:"seconds ago",
            score: 0,
            replyingTo: element.user.username,
            user : {
               image: {
                    png: JSON.parse(storage.comments).currentUser.image.png,
                    webp: JSON.parse(storage.comments).currentUser.image.webp
               },
               username: JSON.parse(storage.comments).currentUser.username     
            },
            replies: []
        }) : null;


        if(element.replies.length){
            element.replies.forEach((element2,r) =>{
                element2.replies.length > 0 ? functionalResponse(parsedStorage.comments[i].replies[r], element2) : null;
                element2.id === id ? parsedStorage.comments[i].replies[r].replies.push({
                    id:JSON.parse(storage.comments).meta.commentNumber + 1,
                    content: document.getElementById(`textfieldEntry${id}`).value,
                    createdAt:"seconds ago",
                    score: 0,
                    replyingTo: element.user.username,
                    user : {
                       image: {
                            png: JSON.parse(storage.comments).currentUser.image.png,
                            webp: JSON.parse(storage.comments).currentUser.image.webp
                       },
                       username: JSON.parse(storage.comments).currentUser.username     
                    },
                    replies: []
                }) : null;
              
            })
            
        }
    })

    parsedStorage.meta.commentNumber = parsedStorage.meta.commentNumber +1; 
    storage.setItem("comments", JSON.stringify(parsedStorage));
    generateHTML();
}

const functionalResponse = (parsedStorage, element) => {
            element.replies.forEach((element2,r) =>{
                element2.replies ? functionalResponse(parsedStorage.replies[r], element2) : null;
        
                element2.id === id ? parsedStorage.replies[r].replies.push({
                    id:JSON.parse(storage.comments).meta.commentNumber + 1,
                    content: document.getElementById(`textfieldEntry${id}`).value,
                    createdAt:"seconds ago",
                    score: 0,
                    replyingTo: element.user.username,
                    user : {
                       image: {
                            png: JSON.parse(storage.comments).currentUser.image.png,
                            webp: JSON.parse(storage.comments).currentUser.image.webp
                       },
                       username: JSON.parse(storage.comments).currentUser.username     
                    },
                    replies: []
                }) : null;
            })
}

storage.length === 0 ? starter() : generateHTML()
