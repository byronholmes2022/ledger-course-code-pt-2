/**
@type{require("node-pg-migrate").MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.addColumn("accounts", {
    default_category_id: {
      type: "integer",
      references: "categories",
      onDelete: "SET NULL",
    },
  });

  pgm.createIndex("accounts", "default_category_id");
};

exports.down = (pgm) => {
  pgm.dropColumn("accounts", "default_category_id");
};
