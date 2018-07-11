var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

const PORT = process.env.PORT || 3000;

var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

//mongoose.connect("mongodb://localhost/bbcnews");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/bbcnews";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.get("/scrape", function (req, res) {

    //axios.get("http://www.cnn.com/politics").then(function (response) {
    axios.get("https://www.bbc.com/news").then(function (response) {

        var $ = cheerio.load(response.data);

        //<span class="cd__headline-text">Red-state Democratic senators refuse Trump's invite to White House Supreme Court announcement</span>
        // $(".cd__headline-text").each(function (i, element) {
        $(".gs-c-promo-body").each(function (i, element) {
            var result = {};
            result.title = //"blah"
                $(this)
                .children('div')
                .children('a')
                .text();
            result.body = //"hi"
                $(this)
                //.children("a")
                .children('div')
                .children('p')
                .text();
            //console.log("result: "+JSON.stringify(result))    
            result.link = //"guys"
                $(this)
                .children('div')
                .children("a")
                .attr("href");

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {

                    //return res.json(err);
                });
            console.log("result: " + JSON.stringify(result))
        });
        res.send("Scrape Complete " + response);
        //return res.json
    });
});
app.get("/articles", function (req, res) {

    db.Article.find({}).sort({createdAt: -1})
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findById({
            _id: req.params.id
        })
        .populate("note")
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });


});

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {

            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });

});

app.put("/articles/:id", function (req, res) {

    db.Article.findOneAndUpdate({
            _id: req.params.id
        }, {
            saved: req.body.saved
        }, {
            new: true
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });

});

app.delete("/articles/:id", function (req, res) {
    const id = req.params.id
  /*  db.Article.findOneAndUpdate(
        //{ email: email },
        { $pull: { note: req.params.id  } },
        { new: true },
        function(err, removedFromUser) {
          if (err) { console.error(err) }
          res.status(200).send(removedFromUser)
        }) */

    db.Note.findByIdAndRemove(
            req.params.id, function(err, dbNote) {
                if (err) {
                    throw err;
                }
            
       /* db.Article.remove({_id: { $in: req.params.note }}, (err, res) => {
            
        })*/
     
    } 
        )
        .exec(function(err, removed) {
            db.Article.findOneAndUpdate(
              { note: id },
              { $unset: { note: id  } },
              { new: true },
              function(err, removedFromUser) {
                if (err) { console.error(err) }
                res.status(200).send(removedFromUser)
              }) 
        })        
      /*  .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });*/

});

app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});