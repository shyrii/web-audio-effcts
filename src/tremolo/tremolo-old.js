import { validate } from '../utils/validate';

export default class Equalizer {
  constructor (context, options) {
    this.context = context;
    this.input = context.createGain();
    this.output = context.createGain();

    this.amp = context.createGain();
    this.depth = context.createGain();
    this.lof = context.createOscillator();

    this.lof.frequency.value = validate(this.meta.speed.min, options.speed, this.meta.speed.max) || this.meta.speed.defaultValue;
    this.depth.gain.value = validate(this.meta.depth.min, options.depth, this.meta.depth.max) || this.meta.depth.defaultValue;
  
    this.input.connect(this.amp);
    this.lof.connect(this.depth);
    this.depth.connect(this.amp.gain);
    this.lof.start(0);
    this.amp.connect(this.output);
  }

  updateParams(options) {
    if (options.speed) {
      this.lof.frequency.value = validate(this.meta.speed.min, options.speed, this.meta.speed.max);
    }
    if (options.depth) {
      this.depth.gain.value = validate(this.meta.depth.min, options.depth, this.meta.depth.max);
    }
  }

  connect(dest) {
    this.output.connect(dest);
  }

  disconnect() {
    this.output.disconnect();
  }

  meta = {
    speed: {
      min: 0,
      max: 20,
      defaultValue: 5,
      type: "float"
    },
    depth: {
      min: 0,
      max: 1,
      defaultValue: 0.3,
      type: "float"
    },
  }
}
