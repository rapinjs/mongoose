import { getRegistry } from '../helpers'
import {isEmpty, includes, isArray} from 'lodash'
export const Auth = (roles: string[] | string = []) => {
  return (target, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value
    descriptor.value = function(...args: any[]): void {
      const registry: any = getRegistry()
      if (registry) {
        if (
          registry
            .get('user')
            .isLogged()
        ) {
          if(!isEmpty(roles)) {
            if(isArray(roles)) {
              if(includes(roles, registry.get('user').getRole().codename)) {
                return originalMethod.apply(this, args)
              } else {
                registry
                  .get('error')
                  .set('unauthorized')
              }
            } else {
              if(roles === registry.get('user').getRole().codename) {
                return originalMethod.apply(this, args)
              } else {
                registry
                  .get('error')
                  .set('unauthorized')
              }
            }
          } else {
            return originalMethod.apply(this, args)
          }
        } else {
          registry
            .get('error')
            .set('unauthorized')
        }
      }
    }
  }
}
