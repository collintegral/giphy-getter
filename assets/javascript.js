// Codes to reference: movie-card-demo, giphy animated tutorial
//pseudocode

//1. Variables
//array for initial button texts
var initialButtons = ["asdf", "Mythbusters", "Reaction", "The Office", "Community", "Parks and Rec"];

//variable to store jquery ref to button-holder
var buttonZone = $("#button-holder");
//variable to store jquery ref to text input
var addBtnInput = $("#gif-input");
var addBtn = $("#add-gif");
//variable to store jquery ref to gif-holder
var gifZone = $("#gif-holder");

//variables for the URL search
var gifGetCount = 20;
var gifGetRating = "PG";
var gifGetAPI = "Xr8uVz6ack0RTa0LhEYg4klTT5I6sv1e";

//2. Pre-page setup
//give the button-holder a .on to query the Giphy API when one of its child buttons is pressed.
buttonZone.on("click", ".gif-btn", getGifs);

//make buttons push them into the button-holder.
function makeButton(btnTxt) {
    var newBtn = $("<button>").attr("class", "gif-btn").text(btnTxt);
    buttonZone.append(newBtn);
}

initialButtons.forEach((entry) => makeButton(entry));

//give the gif-holder a .on to swap the gifs betweeen animated and still with a click.
gifZone.on("click", ".gif-img", function() {
    if (this.getAttribute("movement") == "false") {
        this.setAttribute("src", this.getAttribute("animated-url"));
        this.setAttribute("movement", "true");
    }
    else {
        this.setAttribute("src", this.getAttribute("still-url"));
        this.setAttribute("movement", "false");
    }
});

//make the text input able to make more gif search buttons and add them to the button-holder.
addBtn.on("click", function(event) {
    event.preventDefault();
    if (addBtnInput.val() === "") {return null}
    makeButton(addBtnInput.val().trim());
    addBtnInput.val("");
});

//3. User Interaction
//when a git search button is clicked and the API is queried, make an (object/array) for each of the 10 gif containing the gif,
//a still version of the gif, the rating, and possibly other info. A download button, and potentially a Favorite button as well.
//Then build a div to hold each element of each array, repeat for all arrays, and prepend them all at once into the gif-holder div.
function getGifs() {
    var searchTxt = this.innerText;
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=" + gifGetAPI + "&q=" + searchTxt + "&limit=" + gifGetCount + "&offset=0&rating=" + gifGetRating + "&lang=en";
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        var currentGifs = response.data;

        var gifDivs = [];
        for (var i = 0; i < currentGifs.length; i++) {
            var gifStill = currentGifs[i].images.fixed_height_still.url;
            var gifAnimated = currentGifs[i].images.fixed_height.url;
            var gifImg = $("<img>").attr("src", gifStill).attr("class", "gif-img").attr("movement", false).attr("animated-url", gifAnimated).attr("still-url", gifStill);
            var gifName = $("<h5>").text(currentGifs[i].title).attr("class", "gif-name");
            var gifRate = $("<span>").text("Rated " + currentGifs[i].rating).attr("class", "gif-rate");
            var gifDownload = $("<img>").attr("src", "./assets/dl.png").attr("class", "dl");
            var gifFavorite = $("<img>").attr("src", "./assets/heart.png").attr("class", "fav");
            var gifDiv = $("<div>").attr("class", "gif-div");
            var downloadAbility = $("<a href=\"" + currentGifs[i].images.original.url + "\" download>").attr("class", "dl").append(gifDownload);
            gifDiv.append(downloadAbility, gifFavorite, gifImg, gifName, gifRate);
            gifDivs.push(gifDiv);
            gifDivs.forEach((entry) => {
                gifZone.prepend(entry);
            })
        }
      });
}

//The CSS will need to make sure the gifs don't ever outgrow the viewport, in case of mobile. Should we do multiple columns, or just let them display next to each other?
//Maybe each gif div will have a preset height and the gif will be constrained to that? Then those can line up based on the screen width.