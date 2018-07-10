
$.getJSON("/articles", function(data) {   
    for (var i = 0; i < data.length; i++) {      
      $("#articles").append("<p onclick='selectItem(this)' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].body + "<br />"+ "<a href='https://www.bbc.com/"+data[i].link+"'>"+data[i].link + "</p>");
    }
});

let saveId;



function scrape() {
    $.ajax({
        method: "GET",
        url: "/scrape",
        success: () => {
            console.log("Scraped...");
        }    
      })
      location.reload();
}

function save() {
    //const saveTitle = $('<p>').attr('data-id', e).val();
    $.ajax({
        method: "POST",
        url: "/articles/" + saveId,
        data: {
          // Value taken from title input
          title: $("#titleinput").val(),
          // Value taken from note textarea
          body: $("#bodyinput").val()
        }
      })
        // With that done
        .then(function(data) {
          // Log the response
          console.log(data);
          // Empty the notes section
          $("#notes").empty();
        });

}

function note() {
    //const saveTitle = $('<p>').attr('data-id', e).val();

    $.ajax({
        method: "POST",
        url: "/articles/" + saveId,
        data: {
          // Value taken from title input
          //title: saveTitle,                    //$("#titleinput").val(),
          // Value taken from note textarea
          body: $("#note :input").val()
        }
      })
        // With that done
        .then(function(data) {
          // Log the response
          console.log(data);
          // Empty the notes section
          //$("#notes").empty();
        });
}

function selectItem(e) {
    //saveTitle = $('<p>').attr('data-id', e);
   // saveTitle = document.getAttribute("data-id");
   console.log(e);
   //saveTitle = e.value;
   saveId = e.dataset.id;
   
   //const all = document.getElementsByTagName('p');
   const all = document.querySelectorAll('p');
   for (let i = 0; i < all.length; i++) {
        all[i].style.background = 'white';
        //all[i].style.hover = 'lightblue';
   }
   e.style.background = 'lightblue';
    console.log("saveId: "+JSON.stringify(saveId));
    $("#notes").empty();
    $("#notes").val()

    $.ajax({
        method: "GET",
        url: "/articles/" + saveId
      })
        // With that done, add the note information to the page
        .then(function(data) {
           
           if (data.note) {
                console.log(data.note);
                $("#notes").val(data.note.body);
            } else {
                $("#notes").val("");
            }
        });     
}