const mongoose = require('mongoose');

const schema = {
    username: String,
    password: { type: String },
    email: { type: String },
    transactionId: { type: String },
    phone: { type: String },
    hasPassword: { type: Boolean, default: false },
    emailValidation: { type: Boolean, default: false },
    phoneValidation: { type: Boolean, default: false },
    enable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
};

export const userSchema = new mongoose.Schema(schema,
  {
    collection: 'users',
    read: 'nearest',
  },
);
