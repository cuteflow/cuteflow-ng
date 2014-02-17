var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    crypto = require('crypto');

var userSchema = new mongoose.Schema({
    email: { type: String },
    username: { type: String, unique: true },
    password: String,
    roles: Array,

    profile: {
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' }
    }
});

userSchema.pre('save', function(next) {
    var user = this;
    var SALT_FACTOR = 5;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.gravatar = function(size, defaults) {
    if (!size) size = 200;
    if (!defaults) defaults = 'retro';
    var md5 = crypto.createHash('md5').update(this.email);
    return 'https://gravatar.com/avatar/' + md5.digest('hex').toString() + '?s=' + size + '&d=' + defaults;
};

module.exports = mongoose.model('User', userSchema);