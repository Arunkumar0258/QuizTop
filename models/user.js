const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, lowercase: true},
    email: {type: String},
    phone: {type: Number},
    password: {type: String},
    profile: {
        name: {type: String, default: ''},
        age: Number,
        sex: {type: String, default: ''},
        marks: {type: Number, default: 0},
        comments: {type: String, default: ''},
        photopath: {type: String, default:''},
    }
})

userSchema.pre('save', function(callback) {
    if(!this.email)
        return callback(new Error('missing email'));
    if(!this.password)
        return callback(new Error("missing password"));
    callback();

})


userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

var User = mongoose.model('User', userSchema);

module.exports = User;
