const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js'); // Adjust if your path is different

class Post extends Model {}

Post.init({
  // Column definitions
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255), // Match the VARCHAR(255) in your schema
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // This references the table name `users`, which must be in lowercase here
      key: 'id'
    },
    onDelete: 'CASCADE' // If a user is deleted, their posts will be deleted as well
  }
}, {
  // Model options
  sequelize,
  freezeTableName: true, // Stops Sequelize from automatically pluralizing table names
  tableName: 'posts', // Explicitly defines the table name since freezeTableName is true
  timestamps: true, // Sequelize will add the createdAt and updatedAt fields
  underscored: false, // Use snake_case rather than camelCase for auto-generated fields
});

module.exports = Post;
