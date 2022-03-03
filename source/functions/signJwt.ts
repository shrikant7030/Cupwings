import jwt from "jsonwebtoken";
import config from "../config/config";
import logging from "../config/logging";
import IUser from "../interfaces/user";

const NAMESPACE = 'auth';

const signJwt = (user: IUser, callback: (error:Error | null, token: string| null) => void):void =>{
    var timesince = new Date().getTime();
    var expirationtime = timesince + Number(config.server.token.expiretime) * 100000;
    var expirationTimeInSeconds = Math.floor(expirationtime / 1000);

    logging.info(NAMESPACE, `attempting to signin for token ${user.username}`);

    try{
        jwt.sign(
            {
                username: user.username
            },
            config.server.token.secret,
            {
                issuer: config.server.token.issuer,
                algorithm:'HS256',
                expiresIn: expirationTimeInSeconds
            },
            (error, token) => {
                if(error){
                    callback(error, null);
                }
                else if(token){
                    callback( null, token);
                }
            }
        );
    }
   catch (error: any){
       logging.error( NAMESPACE, error.message, error);
       callback(error, null);
   }    
};


export default signJwt