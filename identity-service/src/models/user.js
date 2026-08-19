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
    area_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Area',
      default: null,
      validate: {
        validator: function (value) {
          if (this.role === 'super_admin') return value == null;
          return value != null;
        },
        message: 'area_id es requerido para supervisor/operator, y debe quedar vacío para super_admin.',
      },
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
