import * as mongoose from 'mongoose'
import { User } from './plugin'
import { isUndefined } from 'lodash'
export * from './decorators'
import { initRegistry } from './helpers'
export default class MongoosePlugin {
  public async afterInitRegistry({config, registry}): Promise<void> {
    try {
      const mongooseClient = await mongoose.connect(config.mongoose.uri, {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoReconnect: true
      })
      registry.set('mongoose', mongooseClient)
    } catch (e) {
      console.log('error')
      console.log(e)
    }
  }
  public async onBeforeRequest({ registry, ctx }): Promise<void> {
    initRegistry({registry})
    registry.set('user', new User(registry))
    const token = !isUndefined(ctx.request.headers.token)
      ? ctx.request.headers.token
      : false

    if (token) {
      await registry.get('user').verify(token)
    } else {
      const authToken = !isUndefined(ctx.request.headers.authorization)
        ? ctx.request.headers.authorization
        : false

      if (authToken) {
        await registry.get('user').verify(authToken)
      }
    }
  }
}