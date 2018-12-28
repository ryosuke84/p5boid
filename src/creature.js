export default ({ p5Instance, initX, initY, maxVelocity, maxSteeringVelocity, dampening }) => {
  const p5 = p5Instance;

  const _draw = self => {
    // const p5 = this.p5;
    p5.stroke(0);
    p5.fill(175);

    self.v1 = p5.createVector(0, 0);
    self.v2 = p5.createVector(-self.vWidth / 2, self.vHeight);
    self.v3 = p5.createVector(self.vWidth / 2, self.vHeight);

    p5.triangle(self.v1.x, self.v1.y, self.v2.x, self.v2.y, self.v3.x, self.v3.y);
  };

  const _displayVehicle = self => {
    // const p5 = this.p5;
    p5.push();
    p5.translate(self.location.x, self.location.y);
    p5.rotate(self.velocity.heading() + p5.PI / 2);
    _draw(self);
    p5.pop();
  };

  const _checkBoundaries = self => {
    // const p5 = this.p5;
    const x = self.location.x;
    const y = self.location.y;

    if (x < 0) {
      self.location.x = p5.width;
    }

    if (x > p5.width) {
      self.location.x = 0;
    }

    if (y < 0) {
      self.location.y = p5.height;
    }

    if (y > p5.height) {
      self.location.y = 0;
    }
  };

  return {
    location: p5.createVector(initX, initY),
    velocity: p5.createVector(),
    acceleration: p5.createVector(),
    maxVelocity,
    maxSteeringVelocity,
    dampening,
    vHeight: 20,
    vWidth: 10,
    v1: null,
    v2: null,
    v3: null,

    render() {
      _displayVehicle(this);
      // this._displayFov();
    },

    applyForce(force) {
      force.limit(this.maxSteeringVelocity);
      this.acceleration.add(force);
    },

    update() {
      // const p5 = this.p5;
      this.velocity.add(this.acceleration);
      this.location.add(this.velocity);
      this.velocity.limit(this.maxVelocity);
      this.velocity.mult(this.dampening);

      this.acceleration.mult(0);
    },

    run() {
      this.update();
      _checkBoundaries(this);
      this.render();
    }
  };
};
