import { validate } from '../utils/validate';

export default class Reverb {
  constructor(context, options) {
    this.context = context;
    this.input = this.output = context.createConvolver();

    this.seconds = validate(this.meta.seconds.min, options.seconds, this.meta.seconds.max) || this.meta.seconds.defaultValue;
    this.decay= validate(this.meta.decay.min, options.decay, this.meta.decay.max) || this.meta.decay.defaultValue;
    // this.delay = validate(this.meta.delay.min, options.delay, this.meta.delay.max) || this.meta.delay.defaultValue;
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
    // if (options.delay) {
    //   this.delay = validate(this.meta.delay.min, options.delay, this.meta.delay.max);
    // }
  }

  connect(dest) {
    this.output.connect(dest);
  }

  disconnect() {
    this.output.disconnect();
  }

  buildImpulse() {
    let rate = this.context.sampleRate
      , length = Math.max(rate * this.seconds, 1)
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

    this.input.buffer = impulse;

  }

  meta = {
    seconds: {
      min: 0.01,
      max: 50,
      defaultValue: 3,
      type: "float"
    },
    decay: {
      min: 0,
      max: 100,
      defaultValue: 2,
      type: "float"
    },
    // delay: {
    //   min: 0,
    //   max: 100,
    //   defaultValue: 2,
    //   type: "float"
    // },
  }
}