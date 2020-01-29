import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';

import TypeDefs from './graphQL/schemas/index';
import Resolvers from './graphQL/resolvers/index';

import isAuth from './middleware/is_Auth';
require('dotenv').config({ path: 'values.env' });

const app = express();

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

app.use(isAuth);
const apollo_server = new ApolloServer({
    typeDefs: TypeDefs,
    resolvers: Resolvers,
    playground: {
        endpoint: 'http://localhost:5000/graphql',
        settings: {
            'editor.theme': 'light'
        }
    },
    context:({req, res}) =>({isAuth: req.isAuth, userId: req.userId})
});

apollo_server.applyMiddleware({
    app
})

mongoose.connect(`mongodb+srv://${
    process.env.MONGO_USER
    }:${
    process.env.MONGO_PASSWORD
    }@cluster0-cbagx.mongodb.net/${
    process.env.MONGO_DB
    }?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT);
        console.log('DB Connection Successful...!')
    })
    .catch(err => {
        console.log(err);
    })