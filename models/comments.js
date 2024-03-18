const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js'); // make sure this path is correct

class Comment extends Model {}

Comment.init({
  // Column definitions
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  commentText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // refers to the actual table name in the database which is lowercase and plural
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'posts', // refers to the actual table name in the database which is lowercase and plural
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  // Model options
  sequelize,
  timestamps: true, // Enable timestamps
  freezeTableName: true, // Prevent Sequelize from renaming the table
  tableName: 'comments', // Explicitly specify the table name exactly as it is in the database
  underscored: false, // Optionally use underscored instead of camelCase for column names
});

module.exports = Comment;
