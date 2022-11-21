import mongoose from "mongoose";

/*
Monthly Time Series Object
{
  DATE1: CLOSE1
  DATE2: CLOSE2
  ...
}
*/

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true
  },
  monthlyTimeSeries: {
    type: Object, 
    default: {}
  }
});

export default mongoose.model('Stock', stockSchema);