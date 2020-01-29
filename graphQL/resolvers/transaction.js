import Transaction from '../../models/transaction';
import User from '../../models/user';
import { transformTransaction, totalPriceInAUD } from './helperFunctions';
const resolver = {
    Query: {
        transactionsOfAUser: async (root, args, req) => {
            if (!req.isAuth) {
                throw new Error('Unauthorized...!');
            }
            try {
                const transOfAUser = await Transaction.find({ boughtBy: { $in: args.userId } });
                return transOfAUser.map(transaction => {
                    return transformTransaction(transaction);
                })
            } catch (err) {
                throw err;
            }
        }
    },
    Mutation: {
        addTransaction: async (root, args, req) => {
            if (!req.isAuth) {
                throw new Error('Unauthorized...!');
            }
            const newTransaction = await new Transaction({
                cryptoName: args.transactionInput.cryptoName,
                units: args.transactionInput.units,
                totalPurchaseAmount: await totalPriceInAUD(args.transactionInput.cryptoName, args.transactionInput.units),
                boughtBy: req.userId
            });
            let savedTransaction;
            try {
                const resultTrans = await newTransaction.save();
                savedTransaction = transformTransaction(resultTrans);
                const fetchedUser = await User.findById(req.userId);
                if (!fetchedUser) {
                    throw new Error('User not found');
                }
                fetchedUser.transactions.push(newTransaction);

                await fetchedUser.save();
                return savedTransaction;
            } catch (err) {
                throw err;
            }
        },
        deleteTransaction: async (root, args, req) => {
            if (!req.isAuth) {
                throw new Error('Unauthorized...!');
            }
            try {
                const transaction = await Transaction.findById(args._id)
                if (!transaction) {
                    throw new Error('Transaction not present...!')
                }
                await Transaction.findOneAndRemove({ _id: args._id });
                return transaction;
            } catch (err) {
                throw err;
            }
        },
        updateTransaction: async (root, args, req) => {
            if (!req.isAuth) {
                throw new Error('Unauthorized...!');
            }
            try {
                const res = await Transaction.findOneAndUpdate({ _id: args._id }, args.transactionInput, { new: true });
                return res;
            } catch (err) {
                throw err;
            }
        }
    }
}
export default resolver;