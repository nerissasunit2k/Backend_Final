const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AccountsUsersSchema = new Schema(
    {
        lastname: { type: String, required: true },
        firstname: { type: String, required: true },
        address: { type: String, required: true },
        age: { type: Number, required: true },
        email: { type: String, required: true },
        contactnumber: { type: String, required: true },
        username: { type: String, required: true },
        password: { type: String, required: true }


    },  {
        collection: 'abangUser'
    }
);

module.exports = mongoose.model('AccountsUsers', AccountsUsersSchema);