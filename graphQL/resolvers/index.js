import transactionResolver from './transaction';
import userResolver from './user';
import cryptoCurrencyResolver from './getAllCryptoNames';
import _ from 'lodash';

export default _.merge(
    transactionResolver,
    userResolver,
    cryptoCurrencyResolver
);