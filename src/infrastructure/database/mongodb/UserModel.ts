import mongoose, { Mongoose } from 'mongoose';
import * as yup from 'yup';

const userSchema: mongoose.Schema = new mongoose.Schema({
    // _id: {
    //     type: mongoose.Types.ObjectId,
    //     validate: {
    //         validator: async (id) => {
    //             return await yup.string().uuid().isValid(id);
    //         }
    //     }
    // },
    // username: {
    //     type: String,
    //     validate:{
    //         validator: async (username) => {
    //             return await yup.string().min(2).max(25).required().isValid(username)
    //         },
    //         message: (props) => `${props.value} must be unique and at least ${2} an less than ${25}`
    //     }, 
    //     required: [true, " username required"],
    //     unique: true,
    // },
    firstname: { type: String, },
    lastname: { type: String },
    address: {
        type: Object,
        validate: {
            validator: async (address: object) => {
                return await yup.object().shape({
                    state: yup.string().required(),
                    city: yup.string(),
                    local: yup.string(),
                    zip: yup.number()
                }).isValid(address)
            },
            message: (props) => `${props.value} missing some required data 'state'`
        }
    },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },    
    lastLogin: {
        type: Date,
        default: new Date()
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        required: true
    },

}, {
    timestamps: true
});


let User = mongoose.model('User', userSchema, 'Users');
export default User;