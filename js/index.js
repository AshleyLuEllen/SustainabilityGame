let pages;
let mapLocations;
let fadeTime = 1000;
let currentRoom = "homePage";

$.getJSON("json/data.json", data => {
    pages = data.pages;
    mapLocations = data.mapLocations;
});

$(document).ready(() => {
    $("#content").fadeIn(fadeTime / 2);

    $(".page").click(event => {
        let mouseX = event.pageX - $(event.target).offset().left;
        let mouseY = event.pageY - $(event.target).offset().top;

        if (pages[$(event.target).attr("id")]) {
            for (let el of pages[$(event.target).attr("id")].clickLocations) {
                if (el.x1 <= mouseX && mouseX <= el.x2 && el.y1 <= mouseY && mouseY <= el.y2) {
                    alert(el.description);
                    break;
                }
            }
        }

        console.log(`Click! ${mouseX} ${mouseY}`);
    });

    $(".map").click(event => {
        let mouseX = event.pageX - $(event.target).offset().left;
        let mouseY = event.pageY - $(event.target).offset().top;

        for (let room of mapLocations) {
            if (room.x1 <= mouseX && mouseX <= room.x2 && room.y1 <= mouseY && mouseY <= room.y2) {
                changeToRoom(room.room);
                break;
            } 
        }
    });
});

function showInstructions() {
    alert("Help message.");
}

function startGame() {
    changeToRoom("livingRoom");
}

function changeToRoom(room) {
    if (room === currentRoom) return;

    $(`#${currentRoom}`).fadeOut(fadeTime);
    $(`#${room}`).fadeIn(fadeTime);
    currentRoom = room;
}