import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('username').unique().notNullable()
      table.string('password').notNullable()
      table.integer('bank_id').unsigned()
      table.foreign('bank_id').references('id').inTable('banks')
      table.integer('squad_id').unsigned()
      table.foreign('squad_id').references('id').inTable('squads')
      table.integer('tribe_id').unsigned()
      table.foreign('tribe_id').references('id').inTable('tribes')
      table.integer('profile_id').unsigned().notNullable()
      table.foreign('profile_id').references('id').inTable('profiles')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
