import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, validator } from '@ioc:Adonis/Core/Validator'

import Squad from 'App/Models/Squad'

interface SquadI {
  name: string
  tribe_id: number
}

export default class SquadsController {
  public async index({ params }: HttpContextContract) {
    const { tribe_id } = params
    return await Squad.query().where({ tribe_id })
  }

  public async store({ request, response, params }: HttpContextContract) {
    const { tribe_id } = params

    const data: SquadI = request.only(['name'])

    try {
      const squadSchema = schema.create({
        name: schema.string(),
      })

      await validator.validate({
        schema: squadSchema,
        data,
      })
    } catch (err) {
      return response.badRequest({
        message: 'O formulário de cadastro foi preenchido incorretamente.',
      })
    }

    const unavailableName = await Squad.query()
      .where({
        name: data.name,
        tribe_id,
      })
      .first()

    if (unavailableName) {
      return response.badRequest({
        message: 'O nome está sendo utilizado por outra squad.',
      })
    }

    data.tribe_id = tribe_id

    const squad = await Squad.create(data)

    return squad
  }

  public async show({ params, response }: HttpContextContract) {
    const { id } = params

    const squad = await Squad.query()
      .preload('tribe')
      .where({
        id,
      })
      .first()

    if (!squad) {
      return response.notFound({
        message: 'A squad não foi encontrada.',
      })
    }

    return squad
  }

  public async update({ request, params, response }: HttpContextContract) {
    const data: SquadI = request.only(['name'])

    const { tribe_id, id } = params

    const squad = await Squad.find(id)

    if (!squad) {
      return response.notFound({
        message: 'A squad não foi encontrada.',
      })
    }

    if (data.name) {
      const unavailableName = await Squad.query()
        .where('name', data.name)
        .whereNot('id', id)
        .first()

      if (unavailableName) {
        return response.badRequest({
          message: 'O nome está sendo utilizado por outra squad.',
        })
      }

      squad.merge({ name: data.name })
    }

    squad.tribe_id = tribe_id

    squad.merge(data)

    await squad.save()

    return response.ok(squad)
  }

  public async destroy({ params, response }: HttpContextContract) {
    const { id } = params

    const squad = await Squad.find(id)

    if (!squad) {
      return response.notFound({
        message: 'A squad não foi encontrada.',
      })
    }

    await squad.delete()

    return response.noContent()
  }
}
