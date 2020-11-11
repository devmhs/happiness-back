import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        name: 'Admnistrador',
        username: 'adm.mhs',
        password: 'mhs.adm',
        profile_id: 3,
      },
    ])
  }
}
