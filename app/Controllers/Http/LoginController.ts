import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
interface bodyRequestDTO {
  username: string
  password: string
}

export default class LoginController {
  public async store({ request, response, auth }: HttpContextContract) {
    const data: bodyRequestDTO = request.only(['username', 'password'])

    try {
      const token = await auth.use('api').attempt(data.username, data.password, {
        expiresIn: '10 days',
      })

      return token
    } catch (err) {
      return response.unauthorized({
        message: 'Credenciais inválidas.',
      })
    }
  }
}
