const { mongoose } = require('../config/database');

const passwordSchema = new mongoose.Schema(
  {
    pswd_value: {
      type: String,
      required: true,
    },
    pswd_name: {
      type: String,
      required: true,
    },
    pswd_description: {
      type: String,
      default: null, // campo opcional
    },
    pswd_ivhex: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Password', passwordSchema);
