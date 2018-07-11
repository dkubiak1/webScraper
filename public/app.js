let saveId;
let saveNote;
let all;
function getAll() {
    $('#delete').hide()
    all = true;
    //$("#notes").val("");
    //saveId = null;
    //saveNote = null;
    $("#articles").empty();
    $('#save').show();
    $('#un-save').hide();
    getJSON(false);
   /* $.getJSON("/articles", function(data) {   
        for (let i = 0; i < data.length; i++) {  
            if (data[i].note) {
                $("#articles").append('<i class="far fa-envelope"></i>');
            }
            if (data[i].saved) {
                $("#articles").append('&nbsp;<i class="far fa-save"></i>');
            }    
            $("#articles").append("<p class='articles' onclick='selectItem(this)' onmouseover='mouseOver(this)' onmouseout='mouseOut(this)' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].body + "<br />"+ "<a href='https://www.bbc.com/"+data[i].link+"'>"+data[i].link + "</p>");
            
            $("#articles").append('<br>')
            if (data[i]._id === saveId)  {
                console.log("saved")
               // $('p').last().css('background', 'lightblue')
                const allP = document.querySelectorAll('.articles');
                allP[allP.length-1].style.background = "lightblue";
                console.log(allP[allP.length-1])
                /*for (let j = 0; j < allP.length; j++) {
                    allP[j].style.background = "lightblue";
                }
            }  
        }
         
    });*/
    
}

function scrape() {
    $.ajax({
        method: "GET",
        url: "/scrape",
        success: () => {
            console.log("Scraped...");
            if (all) {
                getAll();  
            } else {
                showSaved();
            }
        }    
      })      
}

function save(value) { 
    if (saveId !== null) {   
        $.ajax({
            method: "PUT",
            url: "/articles/" + saveId,
            data: {
                saved: value
            },
            success: function() {
                if (value) {
                    getAll();
                } else {
                    showSaved()
                }
            }
        })    
        .then(function(data) {          
            console.log(data);         
        });
        
    } else {
        console.log("Please select an article!");
        $("#myModal").modal();
    }    
}

function note() {
    if (saveId !== null) {
    $.ajax({
        method: "POST",
        url: "/articles/" + saveId,
        data: {         
          body: $("#note :input").val()
        },
        success: function() {
            if (all) {
                getAll();  
            } else {
                showSaved();
            }
        }
      })        
        .then(function(data) {         
          console.log(data);          
        });
        
    } else {
        console.log("Please select an article!");
        $("#myModal").modal();
    }    
}

function selectItem(e) {
    $('#delete').hide()
    console.log(e);   
    saveId = e.dataset.id;     
    const allP = document.querySelectorAll('p');

    for (let i = 0; i < allP.length; i++) {
        allP[i].style.background = 'white';      
    }

    e.style.background = 'lightblue';
    console.log("saveId: "+JSON.stringify(saveId));
    $("#notes").empty();
    //$("#notes").val()

    $.ajax({
        method: "GET",
        url: "/articles/" + saveId
    })        
    .then(function(data) {
           
        if (data.note) {
            console.log(data.note);
            $("#notes").val(data.note.body);
            saveNote = data.note._id;
            $('#delete').show()
        } else {
            $("#notes").val("");
        }
        if (data.saved) {
            $('#save').hide();
            $('#un-save').show();
        } else {
            $('#save').show();
            $('#un-save').hide();
        }
    });     
}

function showSaved() {
    $('#delete').hide()
    all = false;
    //saveId = null;
    //$("#notes").val("");
    $('#articles').empty();
    $('#save').hide();
    $('#un-save').show();
    getJSON(true);
    /*$.getJSON("/articles", function(data) {   
        for (var i = 0; i < data.length; i++) {
            if (data[i].note && data[i].saved) {
                $("#articles").append('<i class="far fa-envelope"></i>');
            }
            if (data[i].saved) {
                $("#articles").append('&nbsp;<i class="far fa-save"></i>');
            }    
            if (data[i].saved) {      
                $("#articles").append("<p class='articles' onclick='selectItem(this)' onmouseover='mouseOver(this)' onmouseout='mouseOut(this)' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].body + "<br />"+ "<a href='https://www.bbc.com/"+data[i].link+"'>"+data[i].link + "</p>");
                $("#articles").append('<br>'); 
            }               
        }
    });*/
}

function deleteNote() {
    if (saveNote !== null) {
    $.ajax({
        method: "DELETE",
        url: "/articles/" + saveNote,
        success: function() {
            if (all) {
                getAll();  
            } else {
                showSaved();
            }
        }
    }) 
    } else {
        console.log("Please select an article!");
        $("#myModal").modal();
    } 
    
}

function getJSON(value) {
    $.getJSON("/articles", function(data) {  
        const div = $('<div/>'); 
        for (let i = 0; i < data.length; i++) {  
            if (data[i].note) {                    //&& data[i].saved || data[i].saved !== value) {
                //$("#articles").append('<i class="far fa-envelope"></i>');
                if (!value || data[i].saved) {
                div.append('<i class="far fa-envelope"></i>');
                }
            }
            if (data[i].saved) {
                //$("#articles").append('&nbsp;<i class="far fa-save"></i>');
                div.append('&nbsp;<i class="far fa-save"></i>');
            }   
            if (data[i].saved || data[i].saved === value) {
                //$("#articles").append("<p class='articles' onclick='selectItem(this)' onmouseover='mouseOver(this)' onmouseout='mouseOut(this)' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].body + "<br />"+ "<a href='https://www.bbc.com/"+data[i].link+"'>"+data[i].link + "</p>");
                div.append("<p class='articles' onclick='selectItem(this)' onmouseover='mouseOver(this)' onmouseout='mouseOut(this)' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].body + "<br />"+ "<a href='https://www.bbc.com/"+data[i].link+"'>"+data[i].link + "</p>");
                div.append('<br>')
                $("#articles").append(div)
            }
            //$("#articles").append('<br>')
            if (data[i]._id === saveId)  {
                console.log("saved")              
                const allP = document.querySelectorAll('.articles');
                if (allP[allP.length-1] && allP[allP.length-1].dataset.id === data[i]._id) {
                    allP[allP.length-1].style.background = "lightblue";
                    saveId = data[i]._id;
                    if (data[i].note) {
                        saveNote = data[i].note._id;
                        $('#delete').show();
                        //$("#notes").val(data[i].note.body);
                    }
                } else {
                    saveId = null;
                    saveNote = null;
                    $("#notes").val("");
                }
                if (data[i].saved) {
                    $('#save').hide();
                    $('#un-save').show();
                } else {
                    $('#save').show();
                    $('#un-save').hide();
                }   
                    console.log(allP[allP.length-1]);                
            }  
        }         
    });
}

function mouseOver(e) {
    if (e.style.background !== 'lightblue') {
        e.style.background = 'cyan';
    }    
}

function mouseOut(e) {
    if (e.style.background === 'cyan') {
        e.style.background = 'white';
    }
   
}

getAll();
