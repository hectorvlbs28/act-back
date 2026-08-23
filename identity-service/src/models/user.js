const mongoose = require('mongoose');
const { ROLES } = require('../constants/roles');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ROLES,
      required: true,
      default: 'operator',
    },
    avatar: {
      type: String,
      default: null,
    },
    area_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Area',
      required: [true, 'area_id es requerido.'],
    },
    deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

userSchema.index({ role: 1 });
userSchema.index({ area_id: 1 });

module.exports = mongoose.model('User', userSchema);
