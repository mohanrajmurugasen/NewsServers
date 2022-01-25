module.exports = (sequelize, DataTypes) => {
  const allNews = sequelize.define("allNews", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    speciality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reporter: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    video: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publish: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    breaking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
  return allNews;
};
