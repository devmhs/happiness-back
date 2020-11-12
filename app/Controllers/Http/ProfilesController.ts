// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Profile from 'App/Models/Profile'

export default class ProfilesController {
  public async index() {
    return await Profile.all()
  }
}
