// Called when form submit button is clicked
async function addPublisher() {
    // url
    let url = `${BASE_URL}publisher`;

    // Get form fields
    const publisherid = Number(document.getElementById("PublisherId").value);
    const publisherName = document.getElementById("PublisherName").value;
    // build request body
    const reqBody = JSON.stringify({
        PublisherName: publisherName
    });

    // Try catch
    try {
        let json = "";
        // determine if this is an insert (POST) or update (PUT)
        // update will include movie id
        json = await postOrPutDataAsync(url, reqBody, "POST");

        // Load Movies
        loadMovies();
        // catch and log any errors
    } catch (err) {
        console.log(err);
        return err;
    }
}

function displayPublisher(publisher) {
    // Use the Array map method to iterate through the array of movies (in json format)
    // Each movie will be formated as HTML table rowsand added to the array
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
    // Finally the output array is inserted as the content into the <tbody id="productRows"> element.

    const rows = publisher.map(publisher => {
        // returns a template string for each movie, values are inserted using ${ }
        // <tr> is a table row and <td> a table division represents a column

        let row = `<tr>
                  <td>${Publisher.PublisherId}</td>
                  <td>${Publisher.PublisherName}</td>
               `;
        row += "</tr>";

        return row;
    });

    // Set the innerHTML of the publisherRows root element = rows
    // Why use join('') ???
    document.getElementById("publisherRows").innerHTML = rows.join("");
} // end function