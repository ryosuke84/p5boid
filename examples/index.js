// import "./styles.css";
import p5 from "p5";
import "p5/lib/addons/p5.dom";
import compose from "lodash.flowright";

import { createBoid, createRandomWalkingMixin, createMouseSeekingMixin, createFovMixin } from "../src/index.js";
import createRandomBoidWithFov from "./randomBoidWithFov";
// import Boid from "@ryosuke84/boid";
// import Creature from "./creature.js";
// import ControllableBoid from "./controllableBoid.js";

// import { GoRandomMixin, createFovMixin, MouseSeekingMixin } from "./behaviors.js";

const sketch = p5 => {
  let canvas;
  let creature;
  let creatures = [];

  p5.setup = () => {
    canvas = p5.createCanvas(600, 400);
    canvas.style("border", "solid 1px");
    p5.background(255);

    // const RandomFovBoid = compose([GoRandomMixin, createFovMixin({ fovRadius: 60, fovAngle: Math.PI / 4 }), MouseSeekingMixin])(Boid);

    // creature = createBoid({
    //   p5Instance: p5,
    //   initX: p5.width / 2,
    //   initY: p5.height / 2,
    //   maxVelocity: 3,
    //   maxSteeringVelocity: 0.3,
    //   dampening: 0.93
    // });

    // const withRandomWalk = createRandomWalkingMixin();
    // const withMouseSeeking = createMouseSeekingMixin();
    // const withFovMixin = createFovMixin({ fovRadius: 60, fovAngle: Math.PI / 4 });
    // creature = Object.assign(creature, withRandomWalk(creature), withMouseSeeking(creature), withFovMixin(creature));

    for (let i = 0; i < 2; i++) {
      creatures.push(
        createRandomBoidWithFov({
          p5Instance: p5,
          initX: p5.width / 2,
          initY: p5.height / 2,
          maxVelocity: 3,
          maxSteeringVelocity: 0.3,
          dampening: 0.93,
          fovRadius: 60,
          fovAngle: Math.PI / 4
        })
      );
    }
    // creature = createRandomBoidWithFov({
    //   p5Instance: p5,
    //   initX: p5.width / 2,
    //   initY: p5.height / 2,
    //   maxVelocity: 3,
    //   maxSteeringVelocity: 0.3,
    //   dampening: 0.93,
    //   fovRadius: 60,
    //   fovAngle: Math.PI / 4
    // });
  };

  p5.draw = () => {
    p5.background(255);

    for (let c of creatures) {
      c.setColor(164, 246, 165);
      c.run();
      if (c.renderFov) {
        c.renderFov();
      }

      if (c.updateFovPoints) {
        const fovPoints = c.updateFovPoints();
        for (let i = 0; i < fovPoints.length; i++) {
          if (i % 200 === 0) {
            p5.push();
            p5.stroke("red");
            p5.strokeWeight(5);
            p5.point(fovPoints[i].x, fovPoints[i].y);
            p5.pop();
          } else {
            // p5.point(fovPoints[i].x, fovPoints[i].y);
          }
        }
      }

      c.goRandom();
    }
    // creature.run();
    // if (creature.renderFov) {
    //   creature.renderFov();
    // }

    // if (creature.updateFovPoints) {
    //   const fovPoints = creature.updateFovPoints();
    //   for (let i = 0; i < fovPoints.length; i++) {
    //     if (i % 200 === 0) {
    //       p5.push();
    //       p5.stroke("red");
    //       p5.strokeWeight(5);
    //       p5.point(fovPoints[i].x, fovPoints[i].y);
    //       p5.pop();
    //     } else {
    //       // p5.point(fovPoints[i].x, fovPoints[i].y);
    //     }
    //   }
    // }

    // if (p5.mouseIsPressed && creature.seekMouse) {
    //   creature.seekMouse(p5.mouseX, p5.mouseY);
    // } else {
    //   creature.goRandom();
    // }
  };
};

const element = document.getElementById("app");
while (element && element.firstChild) {
  element.removeChild(element.firstChild);
}

new p5(sketch, "app");
