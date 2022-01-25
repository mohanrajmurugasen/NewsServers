module.exports = (sequelize, DataTypes) => {
  const speciality = sequelize.define("speciality", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return speciality;
};
