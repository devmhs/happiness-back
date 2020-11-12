import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Bank from '../Models/Bank'
import Squad from '../Models/Squad'
import User from '../Models/User'

export default class Tribe extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @belongsTo(() => Bank, {
    foreignKey: 'bank_id',
  })
  public bank: BelongsTo<typeof Bank>

  @column()
  public bank_id: number

  @hasMany(() => Squad, {
    foreignKey: 'tribe_id',
  })
  public squads: HasMany<typeof Squad>

  @hasMany(() => User, {
    foreignKey: 'tribe_id',
  })
  public users: HasMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
