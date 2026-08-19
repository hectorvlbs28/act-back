const mongoose = require('mongoose');
const { DEFAULT_MODULES } = require('../constants/areaModules');

const STATUSES = ['active', 'deactivated'];

const areaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'active',
    },
    enabled_modules: {
      type: [String],
      default: DEFAULT_MODULES,
    },
  },
  { timestamps: true }
);

const Area = mongoose.model('Area', areaSchema);
Area.STATUSES = STATUSES;

module.exports = Area;
