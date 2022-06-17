var mongoose = require('mongoose');
const { DateTime } = require('luxon')

var Schema = mongoose.Schema;


const NOREC = 'No record'
var AuthorSchema = new Schema (
    {
        first_name: {type: String, required: true, maxlength: 100},
        family_name: {type: String, required: true, maxlength: 100},
        date_of_birth: {type: Date},
        date_of_death: {type: Date},


});

AuthorSchema
.virtual('fine_DOB')
.get( function () {
    return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : NOREC;
});

AuthorSchema
.virtual('fine_DOD')
.get( function () {
    return this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : NOREC
});



AuthorSchema
.virtual('name')
.get( function () {
    // To avoid errors in cases where an author does not have either a family name or first name
    // We want to make sure we handle the exception by returning an empty string for that case
      var fullname = '';
      if (this.first_name && this.family_name) {
        fullname = this.family_name + ', ' + this.first_name
      }
      if (!this.first_name || !this.family_name) {
        fullname = '';
      }
      return fullname;
    });

AuthorSchema.virtual('lifespan').get( () => {
    var lifespan_string = '';
    if (this.date_of_birth) {
        lifespan_string = this.date_of_birth.getYear().toString();
    }
    lifespan_string += ' - ';
    if (this.date_of_death) {
        lifespan_string += this.date_of_death.getYear()
    }
    return lifespan_string
});

AuthorSchema.virtual('url').get( function () {
    return '/catalog/author/' + this._id;
});


module.exports = mongoose.model('Author', AuthorSchema);