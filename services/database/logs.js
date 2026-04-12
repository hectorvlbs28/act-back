const { Log } = require('../../models');

const createLogService = async (user_id, log_type, log_summary) => {
  return Log.create({ user_id, log_type, log_summary });
};

module.exports = { createLogService };
