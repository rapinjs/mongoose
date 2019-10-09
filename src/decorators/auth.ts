import { getRegistry } from '../helpers'

export const Auth = () => {
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
          return originalMethod.apply(this, args)
        } else {
          registry
            .get('error')
            .set('unauthorized')
        }
      }
    }
  }
}
