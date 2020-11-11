import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator } from '@ioc:Adonis/Core/Validator'

interface bodyRequestDTO {
  username: string
  password: string
}

export default class LoginController {
  public async store({ request, response, auth }: HttpContextContract) {
    const data: bodyRequestDTO = request.only(['username', 'password'])

    const userSchema = schema.create({
      username: schema.string(),
      password: schema.string(),
    })

    try {
      await validator.validate({
        schema: userSchema,
        data,
        messages: {
          'username.required': 'O login precisa ser enviado.',
          'password.required': 'A senha precisa ser enviada.',
        },
      })

      try {
        const token = await auth.use('api').attempt(data.username, data.password, {
          expiresIn: '10 days',
        })
        return token
      } catch (err) {
        throw {
          messages: {
            credentials: ['Login ou senha inválido.'],
          },
          status: 400,
        }
      }
    } catch ({ messages: errors, status }) {
      return response.status(status).json({
        errors,
      })
    }
  }
}
