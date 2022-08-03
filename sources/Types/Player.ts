import { Point } from './Point.js'

export type Player = { 
  blocks: Point[], 
  health: number, 
  size: number, 
  score: number, 
  immortal: boolean 
}