import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Squads extends BaseSchema {
  protected tableName = 'squads'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').unique().notNullable()
      table.integer('tribe_id').unsigned().notNullable()
      table.foreign('tribe_id').references('id').inTable('tribes')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
