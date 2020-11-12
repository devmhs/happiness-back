import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User'

interface UserI {
  name: string
  username: string
  password: string
  profile_id: number
  bank_id?: number
  squad_id?: number
  tribe_id?: number
}

export default class UsersController {
  public async index() {
    return await User.query().preload('bank').preload('squad').preload('tribe').preload('profile')
  }

  public async store({ request, response }: HttpContextContract) {
    const data: UserI = request.only([
      'name',
      'username',
      'password',
      'profile_id',
      'bank_id',
      'tribe_id',
      'squad_id',
    ])

    try {
      const userSchema = schema.create({
        name: schema.string(),
        username: schema.string(),
        password: schema.string(),
      })

      await validator.validate({
        schema: userSchema,
        data,
      })
    } catch (err) {
      return response.badRequest({
        message: 'O formulário de cadastro foi preenchido incorretamente.',
      })
    }

    const unavailableUsername = await User.query().where('username', data.username).first()

    if (unavailableUsername) {
      return response.badRequest({
        message: 'O login está sendo utilizado por outro usuário.',
      })
    }

    const user = await User.create(data)

    return user
  }

  public async show({ params, response }: HttpContextContract) {
    const { id } = params

    const user = await User.query()
      .preload('bank')
      .preload('squad')
      .preload('tribe')
      .preload('profile')
      .where('id', id)
      .first()

    if (!user) {
      return response.notFound({
        message: 'O usuário não foi encontrado.',
      })
    }

    return user
  }

  public async update({ request, params, response }: HttpContextContract) {
    const data: UserI = request.only([
      'name',
      'username',
      'password',
      'profile_id',
      'bank_id',
      'tribe_id',
      'squad_id',
    ])

    const { id } = params

    const user = await User.find(id)

    if (!user) {
      return response.notFound({
        message: 'O usuário não foi encontrado.',
      })
    }

    if (data.username) {
      const unavailableUsername = await User.query().where('username', data.username).first()

      if (unavailableUsername) {
        return response.badRequest({
          message: 'O login está sendo utilizado por outro usuário.',
        })
      }

      user.merge({ username: data.username })
    }

    user.merge(data)

    await user.save()

    return response.ok(user)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const { id } = params

    const user = await User.find(id)

    if (!user) {
      return response.notFound({
        message: 'O usuário não foi encontrado.',
      })
    }

    await user.delete()

    return user
  }
}
