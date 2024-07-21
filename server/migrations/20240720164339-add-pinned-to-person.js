module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("People", "pinned", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("People", "pinned");
  },
};
