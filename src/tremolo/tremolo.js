import { validate } from '../utils/validate';

export default class Equalizer {
  constructor (context, options) {
    this.context = context;
    this.input = this.output = context.createGain();
    this.dry = this.wet = context.createGain()
    this.dry.gain.value = 0.5;
    this.wet.gain.value = 0.5;

    this.tremoloGainNode  = context.createGain();
    this.tremoloGainNode.gain.value = 0;
    this.depth = context.createGain();
    this.lof = context.createOscillator();

    this.lof.frequency.value = validate(this.meta.speed.min, options.speed, this.meta.speed.max) || this.meta.speed.defaultValue;
    this.depth.gain.value = validate(this.meta.depth.min, options.depth, this.meta.depth.max) || this.meta.depth.defaultValue;
    
    this.input.connect(this.dry);
    this.dry.connect(this.output);

    this.lof.connect(this.depth);
    this.lof.connect.type = 'sine';
    this.lof.start(0);
    this.depth.connect(this.tremoloGainNode.gain);
    this.input.connect(this.tremoloGainNode);
    this.tremoloGainNode.connect(this.wet);
    this.wet.connect(this.output);

    
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
      defaultValue: 0.7,
      type: "float"
    },
    depth: {
      min: 0,
      max: 1,
      defaultValue: 1,
      type: "float"
    },
  }
}
