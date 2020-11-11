import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Tribes extends BaseSchema {
  protected tableName = 'tribes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').unique().notNullable()
      table.integer('bank_id').unsigned().notNullable()
      table.foreign('bank_id').references('id').inTable('banks')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
