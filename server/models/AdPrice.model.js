const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db/db");

class AdPrice extends Model {}

AdPrice.init(
  {
    ad_price_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    instagram_joint_reel: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    instagram_story: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    instagram_story_repost: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    instagram_post: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    vk_post: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    telegram_post: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    youtube_standard_integration: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    video_greeting: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "AdPrice",
  }
);

module.exports = AdPrice;
