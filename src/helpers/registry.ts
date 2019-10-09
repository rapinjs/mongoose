//@ts-ignore
import { Registry } from 'rapin'

let localRegistry: Registry

export const initRegistry = ({ registry }): void => {
  localRegistry = registry
}

export const getRegistry = (): Registry => localRegistry
