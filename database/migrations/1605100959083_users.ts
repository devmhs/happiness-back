import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('username').unique().notNullable()
      table.string('password').notNullable()
      table
        .integer('bank_id')
        .unsigned()
        .references('id')
        .inTable('banks')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('squad_id')
        .unsigned()
        .references('id')
        .inTable('squads')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('tribe_id')
        .unsigned()
        .references('id')
        .inTable('tribes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table
        .integer('profile_id')
        .unsigned()
        .references('id')
        .inTable('profiles')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
