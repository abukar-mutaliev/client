module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("AdPrices", "instagram_joint_reel", {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn("AdPrices", "instagram_story", {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn("AdPrices", "instagram_story_repost", {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn("AdPrices", "instagram_post", {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn("AdPrices", "vk_post", {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn("AdPrices", "telegram_post", {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn("AdPrices", "youtube_standard_integration", {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn("AdPrices", "video_greeting", {
      type: Sequelize.FLOAT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("AdPrices", "instagram_joint_reel");
    await queryInterface.removeColumn("AdPrices", "instagram_story");
    await queryInterface.removeColumn("AdPrices", "instagram_story_repost");
    await queryInterface.removeColumn("AdPrices", "instagram_post");
    await queryInterface.removeColumn("AdPrices", "vk_post");
    await queryInterface.removeColumn("AdPrices", "telegram_post");
    await queryInterface.removeColumn(
      "AdPrices",
      "youtube_standard_integration"
    );
    await queryInterface.removeColumn("AdPrices", "video_greeting");
  },
};
