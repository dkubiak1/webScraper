var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  title: String,

  body: String
});


var Note = mongoose.model("Note", NoteSchema);

/*Note.pre('remove', function(next) {
  // Remove all the assignment docs that reference the removed person.
  this.model('Article').remove({ note: this._id }, next);
});*/


module.exports = Note;
