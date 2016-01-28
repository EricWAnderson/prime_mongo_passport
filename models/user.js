/**
 * Created by ericanderson on 1/27/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
    username: {type: String, required: true, index: {unique:true}},
    password: {type: String, required: true}
});

UserSchema.pre('save', function(next){
    var user = this;

    if(!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);

            user.password = hash;

            next();
        })
    });

});

UserSchema.methods.comparePassword = function(submittedPassword, callBack){
    bcrypt.compare(submittedPassword, this.password, function(err, isMatch){
        if(err) {
           return callBack(err);
        }
        callBack(null, isMatch);

    });
};

UserSchema.methods.getDisplayName = function(){
  return this.first_name + " " + this.last_name;
};


var myModel = mongoose.model('User', UserSchema);

module.exports = myModel;
