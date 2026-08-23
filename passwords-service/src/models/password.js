const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema(
  {
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
    // Refs cross-servicio: passwords-service no tiene los modelos User/Area en su
    // propia conexión Mongo, así que se guardan como String plano (mismo patrón que
    // Session.user_id en identity-service), no ObjectId+ref.
    owner_id: {
      type: String,
      required: true,
      index: true,
    },
    visibility: {
      type: String,
      enum: ['private', 'area', 'global'],
      required: true,
    },
    area_id: {
      type: String,
      default: null,
      validate: {
        validator: function (value) {
          if (this.visibility === 'area') return value != null && value !== '';
          return value == null;
        },
        message: 'area_id es requerido únicamente cuando visibility es "area".',
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

passwordSchema.index({ visibility: 1, area_id: 1 });

module.exports = mongoose.model('Password', passwordSchema);
