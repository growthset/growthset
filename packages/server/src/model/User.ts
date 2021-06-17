import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

interface Local {
    email: string,
    password: string
}

interface User {
    local: Local
}

// define the schema for our user model
var userSchema = new mongoose.Schema<User>({
    local: {
        email: String,
        password: String
    }
});

// generating a hash
userSchema.methods.generateHash = function(password: string) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// checking if password is valid
userSchema.methods.validPassword = function(password: string) {
    // console.log('comparing password:' + password + "," + this.local.password);
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.toJson = function() {
    return {
        email: (this as any).local.email
    }
}

userSchema.pre('save', function(next) {
    if (!this.isModified('local.password')) return next();
    // encrypt password before saving
    this.local.password = this.generateHash(this.local.password);
    next();
});

// create the model for users and expose it to our app
export default mongoose.model('User', userSchema);
