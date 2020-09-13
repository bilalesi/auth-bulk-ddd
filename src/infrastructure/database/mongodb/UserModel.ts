import mongoose, { Mongoose } from 'mongoose';
import { v4 as uuidv4 } from 'uuid'
import * as yup from 'yup';

export const userSchema: mongoose.Schema = new mongoose.Schema({
    _id: {
        // type: mongoose.Types.ObjectId,
        type: String,
        default: uuidv4,
        validate: {
            validator: async (id) => {
                return await yup.string().uuid().isValid(id);
            },
            message: (props) => `${props.value} _Id not valid`
        },
        required: true
    },
    socialAccounts: [{
        provider: { type: String },
        socialId: { type: String },
    }],
    username: {
        type: String,
        validate:{
            validator: async (username) => {
                return await yup.string().min(2).max(25).required().isValid(username)
            },
            message: (props) => `${props.value} must be unique and at least ${2} an less than ${25}`
        }, 
        required: false,
        // unique: true,
    },
    firstname: { type: String, },
    lastname: { type: String },
    email: {
        type: String,
        validate:{
            validator: async (value) => {
                return await yup.string().email().isValid(value)
            },
            message: (props) => `${props.value} email not valid`
        }
    },
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
    password: { type: String, required: false },
    phone: { type: String,
        validate: {
            validator: async (value) => {
                return await yup.string().matches(/^(00213|\+213|0)(5|6|7)[0-9]{8}$/, { excludeEmptyString: true}).min(9).max(14).isValid(value);
            },
            message: (props) => `${props.value} not recognize as Algeria phone number or is to short`
        }
    },
    isEmailVerified: { type: Boolean, default: false },    
    lastLogin: {
        type: Date,
        default: new Date()
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        required: false
    },

}, {
    timestamps: true
});


let User = mongoose.model('User', userSchema, 'Users');
export default User;