import mongoose, { mongo } from 'mongoose';

const Schema = mongoose.Schema;
const transactionSchema = new Schema({
    cryptoName: {
        type: String,
        required: true
    },
    units: {
        type: Number,
        required: true
    },
    totalPurchaseAmount: {
        type: Number,
        required: true
    },
    boughtBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

},
{timestamps: true});
module.exports = mongoose.model('Transaction', transactionSchema);