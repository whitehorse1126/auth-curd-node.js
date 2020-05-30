// JavaScript for the product page
//
$(document).ready(function(){
$("#addMovieButton").click(function() {
    $("#MovieFormTitle").text("Add a Movie");
    document.getElementById("MoviesId").value = 0; // uses a hidden field - see the form          
    document.getElementById('CategoryId').value = '';
    document.getElementById("PublisherId").value = '';
    document.getElementById("MovieName").value = '';
    document.getElementById("MovieDescription").value = '';            
    document.getElementById("MovieRating").value = '';
    document.getElementById("MovieLength").value = '';
})
});
// CRUD operations

// Parse JSON
// Create product rows
// Display in web page
function displayMovies(movies) {
    // Use the Array map method to iterate through the array of products (in json format)
    // Each products will be formated as HTML table rowsand added to the array
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    // Finally the output array is inserted as the content into the <tbody id="productRows"> element.
    if(movies){
        const rows = movies.map(movie => {
            // returns a template string for each product, values are inserted using ${ }
            // <tr> is a table row and <td> a table division represents a column

            let row = `<tr>
                    <td>${movie.MoviesName}</td>
                    <td>${movie.MoviesDescription}</td>
                    <td>${movie.MoviesRating}</td>
                    <td ${movie.MoviesLength}</td>
                    <td>${movie.PublisherName}</td>`;

            // If user logged in then show edit and delete buttons
            // To add - check user role
            // console.log('userloggedin',userLoggedIn());
            // if (userLoggedIn() === true) {
                row += `<td><button class="btn btn-xs" data-toggle="modal" data-target="#MovieFormDialog" onclick="prepareMovieUpdate(${movie.MoviesId})"><span class="oi oi-pencil"></span></button></td>
                    <td><button class="btn btn-xs" onclick="deleteProduct(${movie.MoviesId})"><span class="oi oi-trash"></span></button></td>`;
            // }
            row += `</tr>`;

            return row;
        });
        // Set the innerHTML of the productRows root element = rows
        // Why use join('') ???
        document.getElementById("MovieRows").innerHTML = rows.join("");
    }
    else{
        document.getElementById("MovieRows").innerHTML = "";
    }
    
    
} // end function

//load and display publishers in a bootstrap list group
function displayPublishers(publishers) {
    const publisherList = publishers.map(publisher =>{
        return `<option value="${publisher.PublisherId}">${publisher.PublisherName}</option>`;
    })
    $("#PublisherId").html(publisherList);
}

// load and display categories in a bootstrap list group
function displayCategory(categories) {
    console.log(categories);
    const items = categories.map(category => {
        return `<a href="#" class="list-group-item list-group-item-action" onclick="updateMoviesView(${category.CategoryId})">${category.CategoryId}. ${category.Category}</a>`;
    });

    // Add an All categories link at the start
    items.unshift(
        `<a href="#" class="list-group-item list-group-item-action" onclick="loadMoviesAll()">Show all</a>`
    );
    const categoryItems = categories.map(category =>{
        return `<option value="${category.CategoryId}">${category.Category}</option>`;
    })
    // Set the innerHTML of the productRows root element = rows
    document.getElementById("CategoryList").innerHTML = items.join("");
    $("#CategoryId").html(categoryItems);
} // end function

// Get all categories and products then display
async function loadMovies() {
    try {
        if(userLoggedIn() === true ) {
            const categories = await getDataAsync(`${BASE_URL}category`);
            displayCategory(categories);

            const movies = await getDataAsync(`${BASE_URL}movies`);
            displayMovies(movies);

            const publishers = await getDataAsync(`${BASE_URL}publisher`);
            // console.log('publisher',publisher);
            displayPublishers(publishers);
        }
    } catch (err) {
        // catch and log any errors
        console.log(err);
    }
}
async function loadMoviesAll() {
    try {
        if(userLoggedIn() === true ) {
            // const categories = await getDataAsync(`${BASE_URL}category`);
            // displayCategory(categories);

            const movies = await getDataAsync(`${BASE_URL}movies`);
            displayMovies(movies);

            // const publishers = await getDataAsync(`${BASE_URL}publisher`);
            // // console.log('publisher',publisher);
            // displayPublishers(publishers);
        }
    } catch (err) {
        // catch and log any errors
        console.log(err);
    }
}

// update products list when category is selected to show only products from that category
async function updateMoviesView(id) {
    try {
        const products = await getDataAsync(`${BASE_URL}movies/bycat/${id}`);
        displayMovies(products);
    } catch (err) {
        // catch and log any errors
        console.log(err);
    }
}

async function returnPublisher(id) {
    try {
        url = `${BASE_URL}publisher/${id}`;

        const response = await fetch(url, GET_INIT);

        const jsona = await getDataAsync(`${BASE_URL}publisher/${id}`);
        const jsonb = await jsona.json();
        console.log("response: " + jsonb.PublisherName);

        return jsonb.PublisherName;

        // catch and log any errors
    } catch (err) {
        console.log(err);
        return err;
    }
}

// When a product is selected for update/ editing, get it by id and fill out the form
async function prepareMovieUpdate(id) {
    try {
        $("#MovieFormTitle").text("Update a Movie");
        // Get broduct by id
        const Movies = await getDataAsync(`${BASE_URL}movies/${id}`);
        // console.log(Movie);
        // Fill out the form
        document.getElementById("MoviesId").value = Movies.MoviesId; // uses a hidden field - see the form          
        document.getElementById('CategoryId').value = Movies.CategoryId;
        document.getElementById("PublisherId").value = Movies.PublisherId;
        document.getElementById("MovieName").value = Movies.MoviesName;
        document.getElementById("MovieDescription").value = Movies.MoviesDescription;            
        document.getElementById("MovieRating").value = Movies.MoviesRating;
        document.getElementById("MovieLength").value = Movies.Movieslength;
    } catch (err) {
        // catch and log any errors
        console.log(err);
    }
}

// Called when form submit button is clicked
async function addOrUpdateMovie() {
    // url
    let url = `${BASE_URL}movies`;

    // Get form fields
    const mid = Number(document.getElementById("MoviesId").value);
    console.log("Id " + mid);
    const catId = document.getElementById("CategoryId").value;
    const PubId = document.getElementById("PublisherId").value;
    const mName = document.getElementById("MovieName").value;
    const mDesc = document.getElementById("MovieDescription").value;
    const mRating = document.getElementById("MovieRating").value;
    const mLength = document.getElementById("MovieLength").value;

    // build request body
    const reqBody = JSON.stringify({
        MoviesId: mid,
        CategoryId: catId,
        PublisherId: PubId,
        MoviesName: mName,
        MoviesDescription: mDesc,
        MoviesRating: mRating,
        MoviesLength: mLength
    });

    // Try catch
    try {
        let json = "";
        // determine if this is an insert (POST) or update (PUT)
        // update will include product id
        if (mid > 0) {
            url += `/${mid}`;
            json = await postOrPutDataAsync(url, reqBody, "PUT");
        } else {
            json = await postOrPutDataAsync(url, reqBody, "POST");
        }
        // Load products
        loadMovies();
        // catch and log any errors
    } catch (err) {
        console.log(err);
        return err;
    }
}

// Delete product by id using an HTTP DELETE request
async function deleteProduct(id) {
    if (confirm("Are you sure?")) {
        // url
        const url = `${BASE_URL}movies/${id}`;

        // Try catch
        try {
            const json = await deleteDataAsync(url);
            console.log("response: " + json);

            loadMovies();

            // catch and log any errors
        } catch (err) {
            console.log(err);
            return err;
        }
    }
}

// Show product button
function showAddMovieButton() {
    let addMovieButton = document.getElementById("addMovieButton");
    // let addPublisherButton = document.getElementById("AddPublisherButton");

    if (userLoggedIn() === true) {
        // viewPublisherButton.style.display = "block";
        addMovieButton.style.display = "block";
        // addPublisherButton.style.display = "block";
    } else {
        // viewPublisherButton.style.display = "none";
        addMovieButton.style.display = "none";
        // addPublisherButton.style.display = "none";
    }
}

// show login or logout
showLoginLink();

// Load products
loadMovies();

showAddMovieButton();