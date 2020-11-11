import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Bank from '../Models/Bank'
import Squad from '../Models/Squad'
import Tribe from '../Models/Tribe'
import Profile from '../Models/Profile'

export default class User extends BaseModel {
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

  @belongsTo(() => Squad, {
    foreignKey: 'squad_id',
  })
  public squad: BelongsTo<typeof Squad>

  @column()
  public squad_id: number

  @belongsTo(() => Tribe, {
    foreignKey: 'tribe_id',
  })
  public tribe: BelongsTo<typeof Tribe>

  @column()
  public tribe_id: number

  @belongsTo(() => Profile, {
    foreignKey: 'profile_id',
  })
  public profile: BelongsTo<typeof Profile>

  @column()
  public profile_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
