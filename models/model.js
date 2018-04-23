var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html


//define variables you want to include in datasetup
//structure of model is defined in route.post (routes.index.js)
var glucoseMeasurements = new Schema({
  name: String,
  type: String,
  state: [],
  sampleTime: String,
  measurement: String,
  dateAdded: {
    type: Date,
    default: Date.now
  },
})



// export Glucose (which references the structure of glucosemeasurements) model so we can interact with it in other files
module.exports = mongoose.model('Glucose', glucoseMeasurements);
