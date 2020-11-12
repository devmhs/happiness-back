import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

import Tribe from '../Models/Tribe'
import Squad from '../Models/Squad'
import User from '../Models/User'

export default class Bank extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @hasMany(() => Tribe, {
    foreignKey: 'bank_id',
  })
  public tribes: HasMany<typeof Tribe>

  @hasMany(() => Squad, {
    foreignKey: 'bank_id',
  })
  public squads: HasMany<typeof Squad>

  @hasMany(() => User, {
    foreignKey: 'bank_id',
  })
  public users: HasMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
