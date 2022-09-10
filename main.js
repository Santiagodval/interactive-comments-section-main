var storage = localStorage;
storage.length === 0 ? starter() : generateHTML();



function starter() {
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

function generateHTML() {
    const chatSection = document.getElementById("comments");

    chatSection.innerHTML = "";

    console.log("genero HTML")

    JSON.parse(storage.comments).comments.forEach(element => {
        chatSection.innerHTML = chatSection.innerHTML + `<section class='comment'>
        <section class='commentHeader'>
            <div class='commentData'>
                <img src=${element.user.image.png}>
                <h4 class='name'>${element.user.username}</h4>
                <p>${element.createdAt}</p>
            </div>

        </section>

        <div class='buttons'>
                ${JSON.parse(storage.comments).currentUser.username === element.user.username ? '<button class="delete"><img src="images/icon-delete.svg">Delete</button>' : ""}
                <button class='reply'>
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
    
    //    console.log(chatSection.innerHTML);
}

function generateResponses(replies){

    let string = "";
    replies.forEach(element => {

        string = string + `
        <div class='response'>
        <section class='commentHeader'>
            <div class='commentData'>
                <img src=${element.user.image.png}>
                <h4 class='name'>${element.user.username}</h4>
                ${JSON.parse(storage.comments).currentUser.username === element.user.username ? '<p class="youTag">you</p>' : ""}
                <p>${element.createdAt}</p>
            </div>

        </section>

        <div class='buttons'>
                ${JSON.parse(storage.comments).currentUser.username === element.user.username ? '<button class="delete"><img src="images/icon-delete.svg">Delete</button>' : ""}

                <button class='reply'>
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
    `})

    return string;
    
}

function deleteButton(){}

function addComment(){

    console.log(storage);

    var parsedStorage = JSON.parse(storage.comments);

    var existingComments = parsedStorage.comments;

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

    console.log(storage);

    generateHTML();
}
