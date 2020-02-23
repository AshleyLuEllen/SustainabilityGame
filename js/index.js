let pages;
let mapLocations;
let fadeTime = 1000;
let currentRoom;
let score;
let lastClick;
let timer;
let thisScore;
let clicks = 0;
let numLocationsTotal;
let numLocationsFound;

$.getJSON("json/data.json", data => {
    pages = data.pages;
    mapLocations = data.mapLocations;

    numLocationsTotal = 0;
    for (let page of Object.keys(pages)) {
        numLocationsTotal += pages[page].clickLocations.length;
    }
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
                    thisScore = Math.ceil(el.points + getTimeBonus() + getClickBonus());

                    $.alert({
                        title: el.title,
                        content: `<p>${el.description}</p>` + (!el.score ? `<p><em>Congratulations! You earned ${thisScore} points!</em></p>` : ""),
                        useBootstrap: false,
                        icon: `fa fa-${el.icon}`,
                        animation: "scale",
                        closeAnimation: "zoom",
                        animateFromElement: false,
                        type: el.score ? "blue" : "green",
                        typeAnimated: true,
                        theme: "material",
                        onClose: addScore,
                        escapeKey: el.score ? "ok" : false,
                        backgroundDismiss: el.score ? "ok" : false
                    });

                    break;
                }
            }
        }

        ++clicks;

        console.log(`Click! ${mouseX} ${mouseY} ${clicks}`);
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

        --clicks;
    });

    $(".end-game").click(e => {
        endGame();
    });

    $(".score-flyer").hide();
});

function showInstructions() {
    $.alert({
        title: "How to Play",
        content: `
            <p><b><em>Sustainability</em></b> is when we live and act in such a way to use less natural resources. Examples of living sustainably would include turning off the lights to save electricity and using less water while in the bathroom. If we do these things, we can work together to save the environment!</p>
            <ul>
                <li>Click on the items in the house that are things which can be <em>changed</em> to live more sustainably or are <em>already good examples</em> of sustainability.</li>
                <li>When you click on an unsustainable item, you will be shown what you can do to better your situation. Try putting some of these skills into practice!</li>
                <li>You get more points depending on how quickly you find objects! But be careful, although speed is a factor, so is accuracy. Just clicking everywhere won't get you a lot of points.</li>
                <li>Try to find all of the items in the house. You get trophies when you finish depending on how many items you find!</li>
            </ul>
        `,
        useBootstrap: false,
        icon: `fa fa-question`,
        animation: "scale",
        closeAnimation: "zoom",
        animateFromElement: false,
        type: "blue",
        typeAnimated: true,
        theme: "material"
    });
}

function startGame() {
    currentRoom = "homePage";
    score = 0;
    numLocationsFound = 0;
    changeToRoom("livingRoom");
    updateScore();
    resetBonuses();
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
        score += thisScore;

        ++numLocationsFound;

        $(".score-flyer").text(`+${thisScore}`);

        $(".score-flyer").show();
    
        $(".score-flyer").addClass("fly");
    
        setInterval(() => {
            $(".score-flyer").hide();
            $(".score-flyer").removeClass("fly");
            updateScore();
        },800);

        resetBonuses();
    }
}

function endGame() {
    if (numLocationsFound < numLocationsTotal / 2) {
        $(".trophy-type").text("bronze");
        $(".end-trophy").addClass("color-bronze");
        $(".end-trophy").removeClass("color-silver");
        $(".end-trophy").removeClass("color-gold");
        $(".trophy-desc").html("You explored the house to find different ways to live sustainably. Unfortunately, you did not find all of the sources of sustainability. <span class='print-hide'>Click \"Play Again!\" to try and find the things you missed!</span>");
    } else if (numLocationsFound < numLocationsTotal * 9 / 10) {
        $(".trophy-type").text("silver");
        $(".end-trophy").removeClass("color-bronze");
        $(".end-trophy").addClass("color-silver");
        $(".end-trophy").removeClass("color-gold");
        $(".trophy-desc").html("You explored the house to find different ways to live sustainably. You found most of the sources of sustainability! <span class='print-hide'>Click \"Play Again!\" to try and find the things you missed!</span>");
    } else {
        $(".trophy-type").text("gold");
        $(".end-trophy").removeClass("color-bronze");
        $(".end-trophy").removeClass("color-silver");
        $(".end-trophy").addClass("color-gold");
        $(".trophy-desc").html("You explored the house to find different ways to live sustainably. You, found all of the sources of sustainability! <span class='print-hide'>Click \"Play Again!\" to try and find the things you missed!</span>");
    }

    for (let page of Object.keys(pages)) {
        for (let loc of pages[page].clickLocations) {
            loc.score = false;
        }
    }
    changeToRoom("endGame");
}

function resetBonuses() {
    timer = Date.now();
    clicks = 0;
}

function getTimeBonus() {
    return Math.max((30000 - (Date.now() - timer)) / 1000 / 30 * 25, 0);
}

function getClickBonus() {
    return Math.max((5 - clicks) * 15, 0);
}

function printCertificate() {
    $('.print-hide').hide();
    $('.print-show').show();
    $('.print-change').addClass("print-mode");
    window.print();
    $('.print-hide').show();
    $('.print-show').hide();
    $('.print-change').removeClass("print-mode");
}