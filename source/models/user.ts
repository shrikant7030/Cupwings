import mongoose, { Schema } from 'mongoose';
import logging from '../config/logging';
import IUser from '../interfaces/user';

const UserSchema: Schema = new Schema(
    {
        username: {type: String, required: true},
        password: {type: String, required: true}
    },
    {
        timestamps: true
    }
);

UserSchema.post<IUser>('save', function () {
    logging.info('Mongo', 'Checkout the user that we just saved: ', this);
});

export default mongoose.model<IUser>('User', UserSchema);
