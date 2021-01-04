var gradeButtonEl = document.querySelectorAll(".button");

//fetch call to get random categories and assign them to category headers
var categories = function () {
    var min = Math.ceil(1);
    var max = Math.floor(18415);
    var result = Math.floor((Math.random() * (max - min)) + min);
    fetch("http://jservice.io/api/categories?count=4&offset=" + result).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                //replace text data on categories page with new categories
                console.log(data);
                document.querySelector("#category-one").textContent = data[0].title;
                document.querySelector("#category-two").textContent = data[1].title;
                document.querySelector("#category-three").textContent = data[2].title;
                document.querySelector("#category-four").textContent = data[3].title;
                //save category ids
                var categoryOneId = data[0].id;
                var categoryTwoId = data[1].id;
                var categoryThreeId = data[2].id;
                var categoryFourId = data[3].id;
                //save category titles
                var titleOne = data[0].title;
                var titleTwo = data[1].title;
                var titleThree = data[2].title;
                var titleFour = data[3].title;
                saveIds(categoryOneId, categoryTwoId, categoryThreeId, categoryFourId, titleOne, titleTwo, titleThree, titleFour);
            });
        } else {
            //change this alert to be modal later
            alert("Error: " + response.statusText);
        }
    });
};

//fetch info from http://jservice.io/api/"category"
//take fetched information and update the quizpage
var gradeButtonClickHandler = function (event) {

    loadIds();

    // mute buttons during game after they are clicked
    var buttonNumber = event.target.getAttribute("data-clicked");
    //var buttonNumber = document.querySelector(event.target.id);
    muteButtonHandler(buttonNumber, event);

    //get difficulty rating of button
    var difficulty = event.target.getAttribute("data-difficulty");

    if (event.target.parentNode.id === "category-1 column") {
        //call questionHandlerFunction with category id and difficulty level
        questionHandler(categoryIds[0], difficulty);
    }
    else if (event.target.parentNode.id === "category-2 column") {
        //call questionHandlerFunction with category id and difficulty level
        questionHandler(categoryIds[1], difficulty);
    }
    else if (event.target.parentNode.id === "category-3 column") {
        //call questionHandlerFunction with category id and difficulty level
        questionHandler(categoryIds[2], difficulty);
    }
    else if (event.target.parentNode.id === "category-4 column") {
        //call questionHandlerFunction with category id and difficulty level
        questionHandler(categoryIds[3], difficulty);
    }
};

var muteButtonHandler = function (buttonNumber, event) {
    clickedButtons = JSON.parse(localStorage.getItem("clickedButtons"));

    //add to comma separated list
    if (clickedButtons) {
        clickedButtons = clickedButtons + "," + buttonNumber;
    }
    //make first clicked button the start of the array
    else {
        clickedButtons = buttonNumber;
    }

    //save back to localStorage
    localStorage.setItem("clickedButtons", JSON.stringify(clickedButtons));
};

var questionHandler = function (id, difficulty) {
    //function to get question data from api
    fetch("http://jservice.io/api/clues?category=" + id + "&value=" + difficulty).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                if (!data.length) {
                    difficulty = difficulty - 100;
                    questionHandler(id, difficulty);
                }
                else {
                    categoryTitle = data[0].category.title;
                    categoryQuestion = data[0].question;
                    categoryAnswer = data[0].answer;
                    console.log(categoryTitle, categoryQuestion, categoryAnswer);
                    window.location.replace("./quizpage.html?categoryTitle=" + categoryTitle + "&categoryQuestion=" + categoryQuestion + "&categoryAnswer=" + categoryAnswer + "&difficulty=" + difficulty);
                }
            });
        }
    });
};

//function to save values of the category ids
var saveIds = function (categoryOneId, categoryTwoId, categoryThreeId, categoryFourId, titleOne, titleTwo, titleThree, titleFour) {
    //assign ids to array
    var categoryIds = [categoryOneId, categoryTwoId, categoryThreeId, categoryFourId];
    //assign titles to array
    var categoryTitles = [titleOne, titleTwo, titleThree, titleFour];
    //save array to storage
    localStorage.setItem("categoryIds", JSON.stringify(categoryIds));
    localStorage.setItem("categoryTitles", JSON.stringify(categoryTitles));
};

//function to load values of the category ids found;
var loadIds = function () {
    //load data for category ids and titles as well as the score
    categoryIds = JSON.parse(localStorage.getItem("categoryIds"));
    categoryTitles = JSON.parse(localStorage.getItem("categoryTitles"));
    score = JSON.parse(localStorage.getItem("score"));
    //assign scores to page
    if (!score) {
        document.querySelector("#current-score").textContent = "Score: " + 0;
    }
    else {
        document.querySelector("#current-score").textContent = "Score: " + score;
    }
    //assign categories to page
    if (!categoryIds) {
        categories();
    }
    else {
        document.querySelector("#category-one").textContent = categoryTitles[0];
        document.querySelector("#category-two").textContent = categoryTitles[1];
        document.querySelector("#category-three").textContent = categoryTitles[2];
        document.querySelector("#category-four").textContent = categoryTitles[3];
    }
    //add mute class to buttons that have already been clicked
    clickedButtons = JSON.parse(localStorage.getItem("clickedButtons"));
    if (clickedButtons) {
        clickedButtonsList = clickedButtons.split(',');
        console.log(clickedButtonsList);
        for ( var i = 0; i < clickedButtonsList.length; i++) {
            document.querySelector("#" + clickedButtonsList[i]).classList.add("disabled");
        };
    };
};

gradeButtonEl.forEach(function (el) {
    el.addEventListener("click", gradeButtonClickHandler);
});

loadIds();