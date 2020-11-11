import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Profile from 'App/Models/Profile'

export default class UsersController {
  public async index({}: HttpContextContract) {
    const profiles = await Profile.all()
    return profiles
  }
}
