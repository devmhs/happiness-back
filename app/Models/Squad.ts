import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Tribe from '../Models/Tribe'
import User from '../Models/User'

export default class Squad extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @belongsTo(() => Tribe, {
    foreignKey: 'tribe_id',
  })
  public tribe: BelongsTo<typeof Tribe>

  @hasMany(() => User, {
    foreignKey: 'squad_id',
  })
  public users: HasMany<typeof User>

  @column()
  public tribe_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
