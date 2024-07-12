module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("PersonNetworks", "network_link", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("PersonNetworks", "network_link");
  },
};
