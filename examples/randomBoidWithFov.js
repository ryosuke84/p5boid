import { createBoid, createRandomWalkingMixin, createFovMixin } from "../src/index.js";

/**
 * Nesting example.
 *
 * @param {object} param
 * @param {number} param.a - First value
 * @param {object} param.b - Wrapper
 * @param {number} param.b.c - Second value
 * @return {number} sum a and b
 */
export default ({ p5Instance, initX, initY, maxVelocity, maxSteeringVelocity, dampening, fovRadius, fovAngle }) => {
  const boid = createBoid({
    p5Instance,
    initX,
    initY,
    maxVelocity,
    maxSteeringVelocity,
    dampening
  });

  const withRandomWalk = createRandomWalkingMixin();
  const withFovMixin = createFovMixin({ fovRadius, fovAngle });
  const randomFovBoid = Object.assign(boid, withRandomWalk(boid), withFovMixin(boid));

  return randomFovBoid;
};
