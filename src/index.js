import Boid from "./boid";
import { randomWalkingMixin, mouseSeekingMixin, fovMixin } from "./behaviors";

export const createBoid = config => Boid(config);
export const createRandomWalkingMixin = () => randomWalkingMixin;
export const createMouseSeekingMixin = () => mouseSeekingMixin;
export const createFovMixin = config => self => {
  config = Object.assign(config, { self });
  return fovMixin(config);
};
