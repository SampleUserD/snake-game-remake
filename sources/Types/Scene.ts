import { Vector } from './Vector.js'

export type Scene = {
  blocks: ({ position: Vector, block: any })[]
}