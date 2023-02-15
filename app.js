// Select DOM elements
const searchBox = document.querySelector("#search-box");
const searchButton = document.querySelector("#search-button");
const modal = document.querySelector("#modalAlert");
const resultsDiv = document.querySelector("#results");
const nextButton = document.createElement("button");
const prevButton = document.createElement("button");

// Set text for next and previous buttons
nextButton.innerHTML = "Next 10";
prevButton.innerHTML = "Previous 10";

// Initialize currentPage variable
let currentPage = 0;

// Event listener for search button click
searchButton.addEventListener("click", function() {
  // Display modal if no terms entered
  if (!searchBox.value || searchBox.value === "Search for books...") {
    modal.style.display = "block";
    return;
  }
  // Set loading message
  resultsDiv.innerHTML = `
    <div id="animationContainer"></div>
    <p class="loading">Fetching Results</p>
  `;

  // Circle sizes
  let circleX, circleY;
  let circleRadius = 5;

   // Create sketch for loading animation
  const mySketch = function(p) {

  // Setup canvas and dims
  p.setup = function() {
    var myCanvas = p.createCanvas(30, 30);
    myCanvas.parent("animationContainer");
    circleX = p.width / 2;
    circleY = p.height / 2;
  };

  // Draw circles
  p.draw = function() {
    p.clear(); // Clears canvas background
    p.strokeWeight(0);
    let angle1 = p.millis() / 1000 * 2; // Set orbit speed
    let angle2 = angle1 + (2 * p.PI) / 5;
    let angle3 = angle1 + 2 * (2 * p.PI) / 5;
    let angle4 = angle1 + 3 * (2 * p.PI) / 5;
    let angle5 = angle1 + 4 * (2 * p.PI) / 5;

    // Orbit navigation
    let x1 = circleX + 8 * p.cos(angle1);
    let y1 = circleY + 8 * p.sin(angle1);
    let x2 = circleX + 8 * p.cos(angle2);
    let y2 = circleY + 8 * p.sin(angle2);
    let x3 = circleX + 8 * p.cos(angle3);
    let y3 = circleY + 8 * p.sin(angle3);
    let x4 = circleX + 8 * p.cos(angle4);
    let y4 = circleY + 8 * p.sin(angle4);
    let x5 = circleX + 8 * p.cos(angle5);
    let y5 = circleY + 8 * p.sin(angle5);

    p.fill(256);
    p.ellipse(x1, y1, circleRadius, circleRadius);
    p.ellipse(x2, y2, circleRadius, circleRadius);
    p.ellipse(x3, y3, circleRadius, circleRadius);
    p.ellipse(x4, y4, circleRadius, circleRadius);
    p.ellipse(x5, y5, circleRadius, circleRadius);
  };
};

  // Create loading animation instance
  new p5(mySketch, "animationContainer");

  // Retrieve term from searchbox
  const searchTerm = searchBox.value;
  // Create URL for API request
  const url = `https://openlibrary.org/search.json?q=${searchTerm}`;

  // Fetch data from API
  fetch(url)
    .then(response => {
      if (response.ok) { // Check if response is ok
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then(data => {
      console.log(data);
      displayResults(data);
    })
    .catch(error => {
      console.error(error);
    });
});

// Initiate search on 'enter'
searchBox.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    searchButton.click();
  }
});

// Next button clock
nextButton.addEventListener("click", function() {
  // Increment current page by 1
  currentPage++;
  // Call displayResults
  displayResults(currentData, currentPage);
  // Scroll to top of results
  resultsDiv.scrollIntoView({ behavior: "smooth" });
});

// Event listener for previous button click
prevButton.addEventListener("click", function() {
  currentPage--; // Decrement current page by 2
  // Call displayResults
  displayResults(currentData, currentPage);
  // Scroll to top of results
  resultsDiv.scrollIntoView({ behavior: "smooth" });
});

// Function to display results
function displayResults(data, page = 0) {
  currentData = data; // Set currentData var
  const books = data.docs; // Retrieve books from JSON

  // Clear contents of restultsDiv
  resultsDiv.innerHTML = "";
  
  // If no results found display message
  if (books.length === 0) {
    resultsDiv.innerHTML = "<p>No Results</p>";
    return;
  }
  
  // Loop to display books on page
  for (let i = page * 10; i < (page + 1) * 10 && i < books.length; i++) {
    // Retrieve book info
    const book = books[i];
    const title = book.title;
    const author = book.author_name;
    const coverID = book.cover_i; // ID for cover image

    // Create Div for each book info
    const bookDiv = document.createElement("div");
    bookDiv.innerHTML = `
      <img src="http://covers.openlibrary.org/b/id/${coverID}-M.jpg">
      <p style="display: inline-block;">Title: ${title}</p>
      <a href="https://www.worldcat.org/search?q=${title}+${author}" target="_blank" style="float: right;">
    WorldCat <i class="fas fa-external-link-alt"></i>
  </a>
  <p>Author: ${author}</p>
  `;
    bookDiv.classList.add("result");
    resultsDiv.appendChild(bookDiv);
  }

  // Div for previous-next buttons
  const buttonDiv = document.createElement("div");
  buttonDiv.style.display = "flex";
  buttonDiv.style.justifyContent = "center";
  
  // Hide previous button on first page
  if (page === 0) {
    prevButton.style.display = "none";
  } else {
    prevButton.style.display = "inline-block";
  }
  
  // Prev and next buttons
  buttonDiv.appendChild(prevButton);
  buttonDiv.appendChild(nextButton);
  resultsDiv.appendChild(buttonDiv);
}

// Set default text for search-box 
const input = document.getElementById("search-box");
// On focus clear box
input.addEventListener("focus", function() {
  if (input.value === "Search for books...") {
    input.value = "";
    input.style.color = "black";
  }
});
// On blur use default text
input.addEventListener("blur", function() {
  if (input.value === "") {
    input.value = "Search for books...";
    input.style.color = "#909090";
  }
});
// On page load use default text
window.addEventListener("load", function() {
  input.value = "Search for books...";
  input.style.color = "#909090";
});


const close = document.querySelector(".close");

// Close the modal when close button is clicked
if (close) {
  close.addEventListener("click", function() {
    modal.style.display = "none";
  });
}

// Close the modal when anywhere outside the modal is clicked
window.addEventListener("click", function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
