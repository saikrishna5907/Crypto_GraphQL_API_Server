import User from '../../models/user';
import Transaction from '../../models/transaction';
const rp = require('request-promise');
require('dotenv').config({ path: '../../values.env' });
// const getSingleUser = async (userId) => {
//     try {
//         const result = await User.findById(userId);
//         return result;
//     } catch (err) {
//         throw err;
//     }
// }
const getTransactionsOfAUser = async transactionIds => {
    try {
        const transactionsOfUser = await Transaction.find({ _id: { $in: transactionIds } });
        return transactionsOfUser.map(transaction => {
            return transformTransaction(transaction);
        })
    } catch (err) {
        throw err;
    }
}
const getUserOfTransaction = async userId => {
    try {
        const user = await User.find({ _id: { $in: userId } })
        return user;
    } catch (err) {
        throw err;
    }
}
const transformUser = user => {
    return {
        ...user._doc,
        _id: user.id,
        //to not show the password to anyone
        password: '',
        transactions: getTransactionsOfAUser.bind(this, user._doc.transactions)
    }
}
const transformTransaction = async transaction => {
    return {
        ...transaction._doc,
        _id: transaction.id,
        boughtBy: getUserOfTransaction.bind(this, transaction.boughtBy)
    }
}

const totalPriceInAUD = async (name, units) => {
    let cryptoData = [];
    let totalPrice = 0.0;
    try {
        const requestOptions = {
            method: 'GET',
            uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
            qs: {
                'start': '1',
                'limit': '100',
                'convert': 'AUD'
            },
            headers: {
                'X-CMC_PRO_API_KEY': process.env.COIN_MARKET_API_KEY
            },
            json: true,
            gzip: true
        };
        await rp(requestOptions).then(response => {
            response.data.map(crypto => {
                if (crypto.name.toLowerCase() === name.toLowerCase()) {
                    totalPrice += units*(crypto.quote.AUD.price ? crypto.quote.AUD.price : 0) 
                }
            })

        }).catch((err) => {
            throw err;
        });
        return totalPrice;
    } catch (err) {
        throw err;
    }
}
exports.totalPriceInAUD = totalPriceInAUD;
exports.transformTransaction = transformTransaction;
exports.transformUser = transformUser;