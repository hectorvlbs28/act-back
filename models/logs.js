module.exports = (sequelize, DataTypes) => {
  const Logs = sequelize.define('Logs', {
    log_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    log_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    log_summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Logs;
};
