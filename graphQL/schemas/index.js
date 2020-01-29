import {gql} from 'apollo-server-express';

const typeDefs = gql`

    type Transaction {
        _id: ID!,
        cryptoName: String!,
        units: Float!,
        totalPurchaseAmount: Float!,
        boughtBy: [User!]!
    }
    input TransactionInput {
        # try later with String! for userId type
        userId: ID!
        cryptoName: String!,
        units: Float!,
    }
    input UpdateTransactionInput {
        cryptoName: String!,
        units: Float!,
        totalPurchaseAmount: Float!,
    }
    type User {
        _id: ID!,
        firstName: String!,
        lastName: String!,
        email: String!,
        password: String!,
        transactions: [Transaction!]!
    }
    input UserInput {
        firstName: String!,
        lastName: String!,
        email: String!,
        password: String!,
    }
    type CryptoCurrency{
        name: String!,
        symbol: String!
        currentValueinAUD: Float!
    }
    type AuthData{
        userId: ID!,
        token: String!,
        expiresIn: Int!
    }
    type Query {
        transactionsOfAUser(userId: String!): [Transaction!]!,
        users: [User!]!,
        login(email: String!, password: String!): AuthData,
        getCryptoNames: [CryptoCurrency!]!
    }
    type Mutation {
        addTransaction(transactionInput : TransactionInput): Transaction,
        addUser(userInput: UserInput): User,
        deleteTransaction(_id: ID!): Transaction,
        updateTransaction(_id: ID!, transactionInput : UpdateTransactionInput): Transaction
    }
`
export default typeDefs;