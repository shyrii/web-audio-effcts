import { validate } from '../utils/validate';

export default class Equalizer {
  constructor (context, options) {
    this.context = context;
    this.input = context.createGain();
    this.output = context.createGain();    
    this.dry = context.createGain();
    this.wet = context.createGain();
    this.dry.gain.value = 0.4;
    this.wet.gain.value = 1;

    this.tremoloGainNode = context.createGain();
    this.tremoloGainNode.gain.value = 0;
    // this.depth = context.createGain();
    this.shaperNode = context.createWaveShaper();
	  // this.shaperNode.curve = new Float32Array([0, 1]);
    const depth = validate(this.meta.depth.min, options.depth, this.meta.depth.max) || this.meta.depth.defaultValue;
    this.shaperNode.curve = new Float32Array([1 - depth, 1]);
    
    this.lof = context.createOscillator();
    this.lof.frequency.value = validate(this.meta.speed.min, options.speed, this.meta.speed.max) || this.meta.speed.defaultValue;

    this.input.connect(this.dry);
    this.dry.connect(this.output);

    this.lof.connect(this.shaperNode);
    this.lof.connect.type = 'sine';
    this.lof.start(0);

    this.shaperNode.connect(this.tremoloGainNode.gain);
    this.input.connect(this.tremoloGainNode);
    this.tremoloGainNode.connect(this.wet);
    this.wet.connect(this.output);
    
  }

  updateParams(options) {
    console.log(options);
    if (options.speed) {
      this.lof.frequency.value = validate(this.meta.speed.min, options.speed, this.meta.speed.max);
    }
    if (options.depth) {
      const depth = validate(this.meta.depth.min, options.depth, this.meta.depth.max);
      this.shaperNode.curve = new Float32Array([1 - depth, 1]);
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
      defaultValue: 4,
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
