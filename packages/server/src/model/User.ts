import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// define the schema for our user model
var userSchema = new mongoose.Schema({
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
    return bcrypt.compareSync(password, (this as any).local.password);
};

userSchema.methods.toJson = function() {
    return {
        email: (this as any).local.email
    }
}

// create the model for users and expose it to our app
export default mongoose.model('User', userSchema);
