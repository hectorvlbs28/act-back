module.exports = (sequelize, DataTypes) => {
  const Passwords = sequelize.define("Passwords", {
    password_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    pswd_value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pswd_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pswd_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pswd_ivhex: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Passwords;
};
