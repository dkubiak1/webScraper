var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
 
  title: {
    type: String,
    required: true,
    unique: true
  },

  body: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },

  saved: {
    type: Boolean,
    default: false
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }

 
},
{
  timestamps: true
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
