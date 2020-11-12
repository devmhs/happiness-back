import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator } from '@ioc:Adonis/Core/Validator'

import Bank from 'App/Models/Bank'

interface BankI {
  name: string
}

export default class BanksController {
  public async index() {
    return await Bank.all()
  }

  public async store({ request, response }: HttpContextContract) {
    const data: BankI = request.only(['name'])

    try {
      const bankSchema = schema.create({
        name: schema.string(),
      })

      await validator.validate({
        schema: bankSchema,
        data,
      })
    } catch (err) {
      return response.badRequest({
        message: 'O formulário de cadastro foi preenchido incorretamente.',
      })
    }

    const unavailableName = await Bank.query().where('name', data.name).first()

    if (unavailableName) {
      return response.badRequest({
        message: 'O nome está sendo utilizado por outro banco.',
      })
    }

    const bank = await Bank.create(data)

    return bank
  }

  public async show({ params, response }: HttpContextContract) {
    const { id } = params

    const bank = await Bank.find(id)

    if (!bank) {
      return response.notFound({
        message: 'O banco não foi encontrado.',
      })
    }

    return bank
  }

  public async update({ request, params, response }: HttpContextContract) {
    const data: BankI = request.only(['name'])

    const { id } = params

    const bank = await Bank.find(id)

    if (!bank) {
      return response.notFound({
        message: 'O banco não foi encontrado.',
      })
    }

    if (data.name) {
      const unavailableName = await Bank.query().where('name', data.name).whereNot('id', id).first()

      if (unavailableName) {
        return response.badRequest({
          message: 'O nome está sendo utilizado por outro banco.',
        })
      }

      bank.merge({ name: data.name })
    }

    bank.merge(data)

    await bank.save()

    return response.ok(bank)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const { id } = params

    const bank = await Bank.find(id)

    if (!bank) {
      return response.notFound({
        message: 'O banco não foi encontrado.',
      })
    }

    await bank.delete()

    return response.noContent()
  }
}
