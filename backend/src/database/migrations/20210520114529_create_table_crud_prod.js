
exports.up = function(knex) {
    return knex.schema.createTable('incidents', (table) => {
      table.increments();
      table.string('codigo_promo').notNullable();
      table.string('title').notNullable();
      table.string('description').notNullable();
      table.decimal('value').notNullable();
      table.integer('users_id').unsigned();
      table.foreign('users_id').references('id').inTable('users');
      table.timestamps();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('incidents');
  };
  