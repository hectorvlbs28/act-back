const { Logs } = require("../../models");

const createLogService = async (user_id, log_type, log_summary) => {
  try {
    const newLog = await Logs.create({
      user_id,
      log_type,
      log_summary,
    });
    return newLog;
  } catch (error) {
    console.error("Error al crear el log:", error);
    throw error;
  }
};

module.exports = {
  createLogService,
};
