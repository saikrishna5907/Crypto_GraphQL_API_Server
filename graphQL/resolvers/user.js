import User from '../../models/user';
import {transformUser} from './helperFunctions';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
require('dotenv').config({ path: '../../values.env' });
const resolver = {
    Query: {
        users: async () => {
            try {
                const fetchedUsers = await User.find();
                return fetchedUsers.map(user => {
                    return transformUser(user);
                })
            }catch(err){
                throw err;
            }
        },
        login: async (root, args) => {
            const user = await User.findOne({email: args.email});
            if(!user){
                throw new Error('Invalid Credentials1...!')
            }
            const isEqual = await bcrypt.compare(args.password, user.password);
            if(!isEqual){
                throw new Error('Invalid Credentials...!');
            }
            const token = jwt.sign({userId: user.id,email: user.email}, process.env.JWT_HASH_SECRET,{expiresIn: '1h'});
            return { userId: user.id, token, expiresIn: 1}
        }
    },
    Mutation: {
        addUser: async (root,args) => {
            let savedUser;
            try{
                const existingUser = await User.findOne({email: args.userInput.email})
                if(existingUser){
                    throw new Error('User exists already...!');
                }
                const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
                const newUser = new User({
                    firstName: args.userInput.firstName,
                    lastName: args.userInput.lastName,
                    email: args.userInput.email,
                    password: hashedPassword,
                    transactions: [],
                });
                const result = await newUser.save();
                savedUser = transformUser(result);
                return savedUser;
            }catch(err){
                throw err;
            }
        }
    }
}
export default resolver;