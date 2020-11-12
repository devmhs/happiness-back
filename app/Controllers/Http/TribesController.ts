import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator } from '@ioc:Adonis/Core/Validator'

import Tribe from 'App/Models/Tribe'

interface TribeI {
  name: string
  bank_id: number
}

export default class TribesController {
  public async index({ params }: HttpContextContract) {
    const { bank_id } = params
    return await Tribe.query().where({ bank_id })
  }

  public async store({ request, response, params }: HttpContextContract) {
    const { bank_id } = params

    const data: TribeI = request.only(['name'])

    try {
      const tribeSchema = schema.create({
        name: schema.string(),
      })

      await validator.validate({
        schema: tribeSchema,
        data,
      })
    } catch (err) {
      return response.badRequest({
        message: 'O formulário de cadastro foi preenchido incorretamente.',
      })
    }

    const unavailableName = await Tribe.query()
      .where({
        name: data.name,
        bank_id,
      })
      .first()

    if (unavailableName) {
      return response.badRequest({
        message: 'O nome está sendo utilizado por outra tribo.',
      })
    }

    data.bank_id = bank_id

    const tribe = await Tribe.create(data)

    return tribe
  }

  public async show({ params, response }: HttpContextContract) {
    const { id } = params

    const tribe = await Tribe.query()
      .preload('bank')
      .where({
        id,
      })
      .first()

    if (!tribe) {
      return response.notFound({
        message: 'A tribo não foi encontrada.',
      })
    }

    return tribe
  }

  public async update({ request, params, response }: HttpContextContract) {
    const data: TribeI = request.only(['name'])

    const { bank_id, id } = params

    const tribe = await Tribe.find(id)

    if (!tribe) {
      return response.notFound({
        message: 'A tribo não foi encontrada.',
      })
    }

    if (data.name) {
      const unavailableName = await Tribe.query()
        .where('name', data.name)
        .whereNot('id', id)
        .first()

      if (unavailableName) {
        return response.badRequest({
          message: 'O nome está sendo utilizado por outra tribo.',
        })
      }

      tribe.merge({ name: data.name })
    }

    tribe.bank_id = bank_id

    tribe.merge(data)

    await tribe.save()

    return response.ok(tribe)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const { id } = params

    const tribe = await Tribe.find(id)

    if (!tribe) {
      return response.notFound({
        message: 'A tribo não foi encontrada.',
      })
    }

    await tribe.delete()

    return response.noContent()
  }
}
