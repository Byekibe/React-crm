import express from 'express';
import schema from './schema/schema.js';
import { graphqlHTTP } from 'express-graphql';
import dotenv from 'dotenv';
import colors from 'colors';
dotenv.config();
import connectDB from './config/db.js';

const app = express();
const port = process.env.PORT;
connectDB();

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});