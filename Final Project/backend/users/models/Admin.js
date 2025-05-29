import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin', 'driver']  
    },
    carId: {
        type: String,
        required: function() {
            return this.role === 'driver'; 
        }
    },
    company: {
        type: String,
        required: function() {
            return this.role === 'admin';  
        }
    }
});

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}

const Admin = mongoose.model('Admin', adminSchema, 'Users');

export default Admin;