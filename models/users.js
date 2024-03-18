const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js'); // Adjust if your path is different

class User extends Model {}

User.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'createdAt' // Ensure the field matches the column name in your database
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
    field: 'updatedAt' // Ensure the field matches the column name in your database
  }
}, {
  // Other model options go here
  sequelize,
  modelName: 'User',
  freezeTableName: true, // This option is false by default, making Sequelize look for a table named 'Users' in plural
  tableName: 'users', // Explicitly setting table name to 'Users' to match your schema
  timestamps: true, // Sequelize will add the createdAt and updatedAt fields
  underscored: false, // If you want to use underscored fields in Sequelize instead of camelCasing
});

module.exports = User;
