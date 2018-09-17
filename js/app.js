//hello

//hello part 2
var deck = [];
var playerCards = [];
var dealerCards = [];
var nums = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
var suits = ['diams', 'clubs', 'hearts', 'spades'];
var playerTable = $("#player-table");
var dealerTable = $("#dealer-table");
var playerValue = $("#player-value");
var dealerValue = $("#dealer-value");
var countCard = 0;

// create Deck:
for (let n = 0; n < nums.length; n++) {
    for (let s = 0; s < suits.length; s++) {
        var cardValue = (n > 9) ? 10 : parseInt(n)+1;
        var card = {
            suit: suits[s],
            cardnum: nums[n],
            cardvalue: cardValue
        }
        deck.push(card);
    }
}

$("#start-btn").on("click", function start() {
    shuffleDeck(deck);
    dealNew();
    $("#start-btn").attr("disabled","disabled");
    $("#start-btn").css({"border" : "transparent",
                        "text-decoration" : "underline",
                        "text-underline-position" : "under"});
    $("#start-instructions").css("visibility", "hidden");
    if (checkTotal(playerCards) !== 21) {
        $("#start-btn").text("Good luck!!!");
    }
    $("#hit-btn").removeAttr("disabled");
    $("#stand-btn").removeAttr("disabled");
    $("#start-btn").css('cursor', 'default');
});

function shuffleDeck(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i+1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function dealNew() {
    playerCards = [];
    dealerCards = [];
    playerValue.html("");
    dealerValue.html("");
    playerTable.html("");
    dealerTable.html("");
    $("#start-btn").text("Good luck!!!");

    if ($("#player-label").hasClass("redLabel")) {
        $("#player-label").removeClass('redLabel');
    }

    if ($("#dealer-label").hasClass("redLabel")) {
        $("#dealer-label").removeClass('redLabel');
    }

    deal();
}

function deal() {
    for (var i = 0; i < 2; i++) {
        dealerCards.push(deck[countCard]);
        dealerTable.append(printCard(countCard, i, dealerTable));
        if (i === 1) {
            var left = dealerTable.children().last().offset().left;
            dealerTable.append('<div class="cover" style="left:' + left + 'px;"></div>');
        }
        cardIncrease();
        playerCards.push(deck[countCard]);
        playerTable.append(printCard(countCard, i, playerTable));
        cardIncrease();
    }
    var playerCurrentValue = checkTotal(playerCards);
    var dealerUncoveredCard = dealerCards[0].cardnum === "A" ? 11 : dealerCards[0].cardvalue;

    playerValue.text(playerCurrentValue);
    dealerValue.text(dealerUncoveredCard);

    //BlackJack case
    if (playerCurrentValue === 21) {
        $("#start-btn").text("BlackJack!!! - Deal again!");
        $("#hit-btn").hide();
        $("#stand-btn").hide();
        $("#deal-btn").css('display', 'block');
    }
}

function cardIncrease() {
    countCard++;
    if (countCard > 30) {
        console.log("new deck");
        countCard = 0;
        shuffleDeck(deck);
    }
}

function printCard(n, i, table) {
    if(i > 0) {
        var reference = table.children().last();
        var scrollLeft = $(window).scrollLeft(); //Distance from left of window to left of document
        var elementOffset = reference.offset().left; //Distance from left of document
    }
    var hpos = (i > 0) ? elementOffset - scrollLeft + $(".card").width()/2 + 10 +'px' : $(window).width() * 0.36 + 'px';
    return "<div class='card "+ deck[n].suit +"' style='left:" + hpos + ";'>" +
        "<div class='top-card suit'>"+deck[n].cardnum+"</div>" +
        "<div class='content-card suit'></div>" +
        "<div class='bottom-card suit'>"+deck[n].cardnum+"</div>" +
    "</div>";
}

// Player options during game (hit, stand, play again)
function playerDecision(a) {
    switch (a) {
        case 'hit':
            playerNextCard(event);
            break;
        case 'stand':
            stand(event);
            break;
        case 'dealAgain':
            $("#deal-btn").hide();
            $("#hit-btn").show();
            $("#stand-btn").show();
            dealNew();
            break;
        default:
            console.log('error');
    }
}

function playerNextCard() {
    playerCards.push(deck[countCard]);
    playerTable.append(printCard(countCard, (playerCards.length - 1), playerTable));
    cardIncrease();
    var playerCurrentValue = checkTotal(playerCards);
    playerValue.text(playerCurrentValue);

    if (playerCurrentValue > 21) {
        $("#player-label").addClass('redLabel');
        $("#start-btn").text("House Wins - Deal again!");
        event.preventDefault();
        $("#hit-btn").hide();
        $("#stand-btn").hide();
        $("#deal-btn").css('display', 'block');
    }
}

function stand() {
    $("#dealer-table").find(".cover").remove();
    var dealerCurrentValue = checkTotal(dealerCards);
    dealerValue.text(dealerCurrentValue);

    while (dealerCurrentValue < 17) {
        dealerCards.push(deck[countCard]);
        dealerTable.append(printCard(countCard,(dealerCards.length - 1), dealerTable));
        cardIncrease();
        dealerCurrentValue = checkTotal(dealerCards);
        dealerValue.text(dealerCurrentValue);
    }

    if (dealerCurrentValue > 21) {
        $("#dealer-label").addClass('redLabel');
    }

    $("#hit-btn").hide();
    $("#stand-btn").hide();
    $("#deal-btn").css('display', 'block');
    endGame();
}

// evaluates winner
function endGame() {
    var playerCurrentValue = checkTotal(playerCards);
    var dealerCurrentValue = checkTotal(dealerCards);

    if (playerCurrentValue > dealerCurrentValue || dealerCurrentValue > 21) {
        $("#start-btn").text("You Win!!! - Deal again!");
    }

    else if (playerCurrentValue < dealerCurrentValue && dealerCurrentValue < 22) {
        $("#start-btn").text("House Wins - Deal again!");
    }

    else if (playerCurrentValue === dealerCurrentValue) {
        $("#start-btn").text("PUSH - Deal again!");
    }
}

function checkTotal(array) {
    var playerTotal = 0;
    var ace = false;
    var aceAdjustment = false;
    for (var i = 0; i < array.length; i++) {

        if (!ace && array[i].cardnum === "A") {
            ace = true;
            playerTotal += 10;
        }
        playerTotal += array[i].cardvalue;
        if (ace && playerTotal > 21 && !aceAdjustment) {
            aceAdjustment = true;
            playerTotal -= 10;
        }
    }
    return playerTotal;
}

$(document).ready(function() {
    var deckImage = "<div class='cover deck'></div>";
    var windowWidth = $(window).width();
    $("#table").prepend(deckImage);
    if (windowWidth < 870) {
        $(".deck").hide();
    }
});

$(window).resize(function() {
    var windowWidth = $(window).width();
    if (windowWidth < 870) {
        $(".deck").hide();
    }
    if (windowWidth > 870) {
        $(".deck").show();
    }
});
