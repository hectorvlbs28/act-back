const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    pswd_value: {
      type: String,
      required: true,
    },
    pswd_name: {
      type: String,
      required: true,
      trim: true,
    },
    pswd_description: {
      type: String,
      trim: true,
      default: null,
    },
    pswd_ivhex: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Password', passwordSchema);
