let pages;
let mapLocations;
let fadeTime = 1000;
let currentRoom;
let score;
let lastClick;

$.getJSON("json/data.json", data => {
    pages = data.pages;
    mapLocations = data.mapLocations;
});

$(document).ready(() => {
    $(".start-menu-text").hide();
    $(".start-menu-buttons").hide();

    $("#content").fadeIn(fadeTime / 2, () => {
        $(".start-menu-text").fadeIn(fadeTime / 2, () => {
            $(".start-menu-buttons").fadeIn(fadeTime / 2);
        });
    });

    $(".page").click(event => {
        let mouseX = event.pageX - $(event.target).offset().left;
        let mouseY = event.pageY - $(event.target).offset().top;

        if (pages[$(event.target).attr("id")]) {
            for (let el of pages[$(event.target).attr("id")].clickLocations) {
                if (el.x1 <= mouseX && mouseX <= el.x2 && el.y1 <= mouseY && mouseY <= el.y2) {
                    lastClick = el;

                    $.alert({
                        title: el.title,
                        content: `<p>${el.description}</p>` + (!el.score ? `<p><em>Congratulations! You earned ${el.points} points!</em></p>` : ""),
                        useBootstrap: false,
                        icon: `fa fa-${el.icon}`,
                        animation: "scale",
                        closeAnimation: "zoom",
                        animateFromElement: false,
                        type: el.score ? "blue" : "green",
                        typeAnimated: true,
                        theme: "material",
                        onClose: addScore
                    });

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

    $(".end-game").click(e => {
        endGame();
    });

    $(".score-flyer").hide();
});

function showInstructions() {
    alert("Help message.");
}

function startGame() {
    currentRoom = "homePage";
    score = 0;
    changeToRoom("livingRoom");
    updateScore();
}

function changeToRoom(room) {
    if (room === currentRoom) return;

    $(`#${currentRoom}`).fadeOut(fadeTime);
    $(`#${room}`).fadeIn(fadeTime);
    currentRoom = room;
}

function updateScore() {
    $(".score").text(score);
}

function addScore() {
    if (!lastClick.score) {
        lastClick.score = true;
        score += lastClick.points;

        $(".score-flyer").text(`+${lastClick.points}`);

        $(".score-flyer").show();
    
        $(".score-flyer").addClass("fly");
    
        setInterval(() => {
            $(".score-flyer").hide();
            $(".score-flyer").removeClass("fly");
            updateScore();
        },800);
    }
}

function endGame() {
    changeToRoom("endGame");
}