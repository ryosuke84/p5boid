import { GoRandomMixin, MouseSeekingMixin } from "./behaviors.js";
import Creature from "./creature.js";

export default class ControllableBoid extends GoRandomMixin(MouseSeekingMixin(Creature)) {}
