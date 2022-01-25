module.exports = (sequelize, DataTypes) => {
  const table = sequelize.define("admin", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    interface: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return table;
};
