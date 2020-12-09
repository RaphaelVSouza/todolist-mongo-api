import mongoose from 'mongoose';

const UserMailSchema = new mongoose.Schema(
    {
    verifyEmailToken: {
        type: String,
        required: true,
    },

    verifyEmailExpires: {
        type: Date,
        required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
  },

},
 {
    timestamps: true
},
);


const UserMail = mongoose.model('UserMail', UserMailSchema);


export default UserMail;
