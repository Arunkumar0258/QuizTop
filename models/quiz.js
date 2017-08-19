const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var quizSchema = new Schema({
    questions: [{type: String, default: ''}],
    answers: [{type: String, default: ''}],
    username: String,
})


quizSchema.pre('save', function(callback) {
    if(!this.username)
        return callback(new Error('No user associated'));
    callback();
})

var Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
