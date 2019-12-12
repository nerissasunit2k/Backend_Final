const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
    name: { type: String, required: true },
    dateReserved: { type: Date, required: true },
    dateReturned: { type: Date, required: true },
    totalRate: { type: Number, required: true }

});
module.exports = mongoose.model('Reservation', ReservationSchema);