import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User'
import Bank from 'App/Models/Bank'
import Squad from 'App/Models/Squad'
import Tribe from 'App/Models/Tribe'
import Profile from 'App/Models/Profile'

import GetFormattedErrorService from 'App/Services/GetFormattedErrorService'

interface bodyRequestDTO {
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
    const users = await User.query()
      .preload('bank')
      .preload('squad')
      .preload('tribe')
      .preload('profile')
    return users
  }

  public async store({ request, response }: HttpContextContract) {
    const data: bodyRequestDTO = request.only(['name', 'username', 'password'])

    const userSchema = schema.create({
      name: schema.string(),
      username: schema.string(),
      password: schema.string(),
    })

    try {
      await validator.validate({
        schema: userSchema,
        data,
        messages: {
          'name.required': 'O nome precisa ser enviado.',
          'username.required': 'O login precisa ser enviado.',
          'password.required': 'A senha precisa ser enviada.',
        },
      })

      const { profile_id } = request.get()

      if (!profile_id) {
        throw {
          messages: {
            profile_id: ['O id de perfil precisa ser enviado.'],
          },
          status: 400,
        }
      } else {
        const profileExists = await Profile.find(profile_id)
        if (!profileExists) {
          throw {
            messages: {
              profile_id: ['O perfil solicitado não foi encontrado.'],
            },
            status: 404,
          }
        }
        data.profile_id = parseInt(profile_id)
      }

      const unavailableUsername = await User.query().where('username', data.username).first()

      if (unavailableUsername) {
        throw {
          messages: {
            username: ['Este login já está sendo utilizado por outro usuário.'],
          },
          status: 401,
        }
      }

      const { bank_id, squad_id, tribe_id } = request.get()

      if (bank_id) {
        const bank = await Bank.find(bank_id)
        if (!bank) {
          throw {
            messages: {
              bank_id: ['O banco solicitado não foi encontrado.'],
            },
            status: 404,
          }
        }
        data.bank_id = parseInt(bank_id)
      }

      if (squad_id) {
        const squad = await Squad.find(squad_id)
        if (!squad) {
          throw {
            messages: {
              squad_id: ['A squad solicitada não foi encontrada.'],
            },
            status: 404,
          }
        }
        data.squad_id = parseInt(squad_id)
      }

      if (tribe_id) {
        const tribe = await Tribe.find(tribe_id)
        if (!tribe) {
          throw {
            messages: {
              tribe_id: ['A tribo solicitada não foi encontrada.'],
            },
            status: 404,
          }
        }
        data.tribe_id = parseInt(tribe_id)
      }

      const user = await User.create(data)

      delete user.$attributes.password

      return response.ok(user)
    } catch ({ messages, status }) {
      const errors = await GetFormattedErrorService.execute({ errors: messages })

      return response.status(status).json({
        errors,
      })
    }
  }
}
