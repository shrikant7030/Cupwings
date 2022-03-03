import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import logging from '../config/logging';
import User from '../models/user';
import * as bcryptjs from "bcryptjs";
import signJwt from '../functions/signJwt';


const NAMESPACE = "User";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, "token validated, user authenticated");

    return res.status(200).json({
        message:"Authorized"
    })
};


const register = (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;

    bcryptjs.hash(password, 10, (hashError: any, hash: any) =>{
        if(hashError){
            return res.status(500).json({
                message: hashError.message,
                error: hashError
            })
        }

        const _user = new User({
            _id: new mongoose.Types.ObjectId(),
            username,
            password: hash
        });

        return _user.save()
        .then(user =>{
            return res.status(201).json({
                user
            });
        })
        .catch (error =>{
            return res.status(500).json({
                message: error.message,
                error
            });
        });
     });
};


const login = (req: Request, res: Response, next: NextFunction) => {
    let { username, password } = req.body;

    User.find({ username })
    .exec()
    .then(users =>{
        if(users.length !== 1){
            return res.status(400).json({
                message: 'unauthorized'
            });
        }

        bcryptjs.compare(password, users[0].password, (error, result) =>{
            if(error){
                logging.error(NAMESPACE, error.message, error);

                return res.status(400).json({
                message: 'unauthorized'
                });
            }
            else if(result)
            {
                signJwt(users[0], (_error, token) => {
                    if(_error)
                    {
                        logging.error(NAMESPACE, 'not able to signin with the token', error);

                        return res.status(400).json({
                            message: 'unauthorized',
                            error: _error
                        })
                    }
                    else if(token){
                        return res.status(200).json({
                            message: 'auth successful',
                            token,
                            user: users[0]
                        })
                    }
                })
            }
        })
    })
    .catch((error) => {
        return res.status(500).json({
                message: error.message,
                error
            });
    });
};


const getAllUser = (req: Request, res: Response, next: NextFunction) => {
    User.find()
    .select('-password')
    .exec()
    .then(users => {
        return res.status(200).json({
            users,
            count: users.length
        });
    })
    .catch((error) => {
        return res.status(500).json({
                message: error.message,
                error
            });
    });
};


// const insertRecords = (req: Request, res: Response, next: NextFunction) => {
//     let { name, email, password } = req.body;

//     const book = new User({
//         _id: new mongoose.Types.ObjectId(),
//         name,
//         email,
//         password
//     });

//     return book
//         .save()
//         .then(() => {
//             return res.status(201).json({
//                signup: "record saved successfully"
//             });
//         })
//         .catch((error) => {
//             return res.status(500).json({
//                 message: error.message,
//                 error
//             });
//         });
// };

// const getData = (req: Request, res: Response, next: NextFunction) => {
//     let {email, password } = req.body;
//     User.find({email:email, password:password})
//         .exec()
//         .then((users) => {
//             return res.status(200).json({
//                 records: users,
//                 // count: books.length
//             });
//         })
//         .catch((error) => {
//             return res.status(500).json({
//                 message: error.message,
//                 error
//             });
//         });
// };

export default { validateToken, login, register, getAllUser };
