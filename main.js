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
                <button>
                    <img src='images/icon-delete.svg'>
                    delete
                </button>

                <button>
                    <img src='images/icon-reply.svg'>
                    reply
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

    
    //    console.log(chatSection.innerHTML);
}

function generateResponses(replies){

    let string = "";
    replies.forEach(element => {
                
        console.log(element);

        string = string + `
        <div class='response'>
        <section class='commentHeader'>
            <div class='commentData'>
                <img src=${element.user.image.png}>
                <h4 class='name'>${element.user.username}</h4>
                <p>${element.createdAt}</p>
            </div>

        </section>

        <div class='buttons'>
                <button>
                    <img src='images/icon-delete.svg'>
                    delete
                </button>

                <button>
                    <img src='images/icon-reply.svg'>
                    reply
                </button>
            
            </div>

        <div class='scoreCounter'>
                <button class='add'><img src='images/icon-plus.svg'></button>
                ${element.score}
                <button class='minus'><img src='images/icon-minus.svg'></button>
            </div>

        <section class='commentTextSection'>
            <p class='commentTextContent'><strong>${element.replyingTo}</strong>${element.content}</p>
        </section>
        </div>
    `})

    return string;
    
}
