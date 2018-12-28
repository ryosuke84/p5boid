import p5 from "p5";

export const randomWalkingMixin = self => {
  const noiseIncrement = 0.03;
  let noiseX = p5.prototype.random(0, 1000);
  let noiseY = noiseX + 10000;

  return {
    goRandom() {
      noiseX += noiseIncrement;
      noiseY += noiseIncrement;
      const mappedX = p5.prototype.map(p5.prototype.noise(noiseX), 0, 1, -1, 1, true);
      const mappedY = p5.prototype.map(p5.prototype.noise(noiseY), 0, 1, -1, 1, true);
      self.applyForce(p5.prototype.createVector(mappedX, mappedY));
    }
  };
};
// export const GoRandomMixin = superclass => {
//   let noiseIncrement = 0.03;
//   let noiseX = p5.prototype.random(0, 1000);
//   let noiseY = noiseX + 10000;
//   return class extends superclass {
//     //   constructor(...args) {
//     //     super(...args);
//     //     this.noiseIncrement = 0.03;
//     //     this.noiseX = this.p5.random(0, 1000);
//     //     this.noiseY = this.noiseX + 10000;
//     //   }

//     // goRandom() {
//     //   const p5 = this.p5;
//     //   this.noiseX += this.noiseIncrement;
//     //   this.noiseY += this.noiseIncrement;
//     //   const mappedX = p5.map(p5.noise(this.noiseX), 0, 1, -1, 1, true);
//     //   const mappedY = p5.map(p5.noise(this.noiseY), 0, 1, -1, 1, true);
//     //   this.applyForce(p5.createVector(mappedX, mappedY));
//     // }
//     goRandom() {
//       noiseX += noiseIncrement;
//       noiseY += noiseIncrement;
//       const mappedX = p5.prototype.map(p5.prototype.noise(noiseX), 0, 1, -1, 1, true);
//       const mappedY = p5.prototype.map(p5.prototype.noise(noiseY), 0, 1, -1, 1, true);
//       super.applyForce(p5.prototype.createVector(mappedX, mappedY));
//     }
//   };
// };

export const mouseSeekingMixin = self => ({
  seekMouse(mouseX, mouseY) {
    // const p5 = this.p5;
    const mouse = p5.prototype.createVector(mouseX, mouseY);
    const force = mouse.sub(self.location);
    self.applyForce(force);
  }
});

// export const MouseSeekingMixin = superclass =>
//   class extends superclass {
//     seekMouse(mouseX, mouseY) {
//       const p5 = this.p5;
//       const mouse = p5.createVector(mouseX, mouseY);
//       const force = mouse.sub(this.location);
//       this.applyForce(force);
//     }
//   };

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
    this.fovPoints = points;
    return points;
  };

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
    }
  };
};

export const createFocMixin = ({ fovRadius = 60, fovAngle = Math.PI / 4 }) => {
  return superclass =>
    class extends superclass {
      constructor(...args) {
        super(...args);
        this.fovPoints = this._getFovPoints();
      }

      renderFov() {
        const p5 = this.p5;
        p5.push();
        p5.arc(
          this.location.x,
          this.location.y,
          fovRadius * 2,
          fovRadius * 2,
          this.velocity.heading() - fovAngle,
          this.velocity.heading() + fovAngle,
          p5.PIE
        );
        p5.pop();
      }

      _getFovPoints() {
        const start = this.velocity.heading() - fovAngle;
        const end = this.velocity.heading() + fovAngle;
        const T1 = start >= -Math.PI ? start : start + Math.PI * 2;
        const T2 = end < Math.PI ? end : end - Math.PI * 2;

        //Check if start and end angles are into II and III quadrant
        const reversedAngles = T1 > T2;

        const points = [];
        for (let x = this.location.x - fovRadius; x < this.location.x + fovRadius; x++) {
          for (let y = this.location.y - fovRadius; y < this.location.y + fovRadius; y++) {
            const r = Math.sqrt(Math.pow(x - this.location.x, 2) + Math.pow(y - this.location.y, 2));
            let theta = Math.atan2(y - this.location.y, x - this.location.x);

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
                deltaTheta: theta - this.velocity.heading()
              });
            }
          }
        }
        this.fovPoints = points;
        return points;
      }

      updateFovPoints() {
        const newPositions = [];
        for (const pos of this.fovPoints) {
          const newTheta = (pos.theta = this.velocity.heading() + pos.deltaTheta);
          const newX = pos.r * Math.cos(newTheta) + this.location.x;
          const newY = pos.r * Math.sin(newTheta) + this.location.y;
          const newPos = {
            x: Math.floor(newX),
            y: Math.floor(newY),
            r: pos.r,
            theta: newTheta,
            deltaTheta: pos.deltaTheta
          };
          newPositions.push(newPos);
        }
        this.fovPoints = newPositions;
        return newPositions;
      }
    };
};
