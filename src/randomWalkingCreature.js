import { GoRandomMixin } from "./behaviors.js";
import Creature from "./creature.js";

export default class RandomBoid extends GoRandomMixin(Creature) {}
