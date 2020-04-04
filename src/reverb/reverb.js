import { validate } from '../utils/validate';

export default class Reverb {
  constructor(context, options) {
    this.context = context;
    this.input = context.createGain();
    this.output = context.createGain();
    this.wet = context.createGain();
    this.dry = context.createGain();
    // this.dry.gain.value = 1;
    // this.wet.gain.value = 1;
    this.reverbNode = context.createConvolver();

    this.seconds = validate(this.meta.seconds.min, options.seconds, this.meta.seconds.max) || this.meta.seconds.defaultValue;
    this.decay= validate(this.meta.decay.min, options.decay, this.meta.decay.max) || this.meta.decay.defaultValue;
    this.wet.gain.value = validate(this.meta.wet.min, options.wet, this.meta.wet.max) || this.meta.wet.defaultValue;
    this.dry.gain.value = validate(this.meta.dry.min, options.wet, this.meta.dry.max) || this.meta.dry.defaultValue;

    this.input.connect(this.dry);
    this.dry.connect(this.output);
    this.input.connect(this.reverbNode);
    this.reverbNode.connect(this.wet);
    this.wet.connect(this.output);
  }

  updateParams(options) {
    if (options.seconds) {
      this.seconds = validate(this.meta.seconds.min, options.seconds, this.meta.seconds.max);
      this.buildImpulse();
    }
    if (options.decay) {
      this.decay= validate(this.meta.decay.min, options.decay, this.meta.decay.max);
      this.buildImpulse();
    }
    if (options.wet) {
      this.wet.gain.value = validate(this.meta.wet.min, options.wet, this.meta.wet.max);
    }
    if (options.dry) {
      this.dry.gain.value = validate(this.meta.dry.min, options.dry, this.meta.dry.max);
    }
  }

  connect(dest) {
    this.output.connect(dest);
  }

  disconnect() {
    this.output.disconnect();
  }

  buildImpulse() {
    let rate = this.context.sampleRate
      , length = rate * this.seconds
      // , delayDuration = rate * this.delay
      , impulse = this.context.createBuffer(2, length, rate)
      , impulseL = impulse.getChannelData(0)
      , impulseR = impulse.getChannelData(1)
      , n, i;
      
    for (i = 0; i < length; i++) {
        n = this.reverse ? length - i : i;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, this.decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, this.decay);
    }

    // this.input.buffer = impulse;
    if (this.reverbNode.buffer) {
      this.input.disconnect(this.reverbNode);
      this.reverbNode.disconnect(this.wet);

      this.reverbNode = this.context.createConvolver();
      this.input.connect(this.reverbNode);
      this.reverbNode.connect(this.wet);
    }

    this.reverbNode.buffer = impulse;

  }

  meta = {
    seconds: {
      min: 0.001,
      max: 10,
      defaultValue: 0.01,
      type: "float"
    },
    decay: {
      min: 0.0001,
      max: 10,
      defaultValue: 0.01,
      type: "float"
    },
    wet: {
      min: 0,
      max: 1,
      defaultValue: 0.6,
      type: "float"
    },
    dry: {
      min: 0,
      max: 1,
      defaultValue: 0.4,
      type: "float"
    }
  }
}