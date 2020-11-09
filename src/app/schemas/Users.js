const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select:false,
    },
    passwordResetToken: {
        type: String,
      select:false,
    },
    passwordResetExpires: {
        type:Date,
      select:false,
    },
   
   
},
 { 
    timestamps: true 
},
);

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
})



const User = mongoose.model('User', UserSchema);

module.exports = User;