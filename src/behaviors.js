import p5 from "p5";

export const randomWalkingMixin = self => {
  const noiseIncrement = 0.03;
  let noiseX = p5.prototype.random(0, 1000);
  let noiseY = noiseX + 10000;

  return {
    /**
     * Walk randomly
     * @param {string} test - No need for input
     */
    goRandom() {
      noiseX += noiseIncrement;
      noiseY += noiseIncrement;
      const mappedX = p5.prototype.map(p5.prototype.noise(noiseX), 0, 1, -1, 1, true);
      const mappedY = p5.prototype.map(p5.prototype.noise(noiseY), 0, 1, -1, 1, true);
      self.applyForce(p5.prototype.createVector(mappedX, mappedY));
    }
  };
};

export const mouseSeekingMixin = self => ({
  seekMouse(mouseX, mouseY) {
    // const p5 = this.p5;
    const mouse = p5.prototype.createVector(mouseX, mouseY);
    const force = mouse.sub(self.location);
    self.applyForce(force);
  }
});

export const fovMixin = ({ self, fovRadius, fovAngle }) => {
  const _getFovPoints = self => {
    const start = self.velocity.heading() - fovAngle;
    const end = self.velocity.heading() + fovAngle;
    const T1 = start >= -Math.PI ? start : start + Math.PI * 2;
    const T2 = end < Math.PI ? end : end - Math.PI * 2;

    //Check if start and end angles are into II and III quadrant
    const reversedAngles = T1 > T2;

    const points = [];
    for (let x = self.location.x - fovRadius; x < self.location.x + fovRadius; x++) {
      for (let y = self.location.y - fovRadius; y < self.location.y + fovRadius; y++) {
        const r = Math.sqrt(Math.pow(x - self.location.x, 2) + Math.pow(y - self.location.y, 2));
        let theta = Math.atan2(y - self.location.y, x - self.location.x);

        if (
          r < fovRadius &&
          //  The condition to check whenstart and end angles are into II and III quadrant --------
          ((reversedAngles && ((theta >= -Math.PI && theta < T2) || (theta > T1 && theta <= Math.PI))) ||
            //  The condition to check when start and end angles are not into II and III quadrant --------
            (!reversedAngles && theta > T1 && theta < T2))
        ) {
          // points.push({ x: Math.floor(x), y: Math.floor(y) });
          points.push({
            x: Math.floor(x),
            y: Math.floor(y),
            r: r,
            theta: theta,
            deltaTheta: theta - self.velocity.heading()
          });
        }
      }
    }
    // this.fovPoints = points;
    return points;
  };

  let fovPoints = _getFovPoints(self);

  return {
    renderFov() {
      const p5 = self.p5;
      p5.push();
      p5.arc(
        self.location.x,
        self.location.y,
        fovRadius * 2,
        fovRadius * 2,
        self.velocity.heading() - fovAngle,
        self.velocity.heading() + fovAngle,
        p5.PIE
      );
      p5.pop();
    },

    updateFovPoints() {
      const newPositions = [];
      for (const pos of fovPoints) {
        const newTheta = (pos.theta = self.velocity.heading() + pos.deltaTheta);
        const newX = pos.r * Math.cos(newTheta) + self.location.x;
        const newY = pos.r * Math.sin(newTheta) + self.location.y;
        const newPos = {
          x: Math.floor(newX),
          y: Math.floor(newY),
          r: pos.r,
          theta: newTheta,
          deltaTheta: pos.deltaTheta
        };
        newPositions.push(newPos);
      }
      // this.fovPoints = newPositions;
      return newPositions;
    }
  };
};
