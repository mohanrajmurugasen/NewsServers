module.exports = (sequelize,DataTypes) => {
    const nation = sequelize.define('adminNation',{
        image: {
            type: DataTypes.STRING,
            allowNull: false
        },
        heading: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        video: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });
    return nation;
}