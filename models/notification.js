module.exports = (sequelize, DataTypes) => {
  const notification = sequelize.define("notification", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return notification;
};
