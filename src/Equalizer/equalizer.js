import { validate } from '../utils/validate';

export default class Equalizer {
  constructor (context, options) {
    this.context = context;
    this.input = context.createGain();
    this.output = context.createGain();

    let gainDb = -40.0;
    let bandSplit = [360,3600];

    this.hBand = context.createBiquadFilter();
    this.hBand.type = "lowshelf";
    this.hBand.frequency.value = bandSplit[0];
    this.hBand.gain.value = gainDb;

    this.hInvert = context.createGain();
    this.hInvert.gain.value = -1.0;

    this.mBand = context.createGain();

    this.lBand = context.createBiquadFilter();
    this.lBand.type = "highshelf";
    this.lBand.frequency.value = bandSplit[1];
    this.lBand.gain.value = gainDb;

    this.lInvert = context.createGain();
    this.lInvert.gain.value = -1.0;

    this.input.connect(this.lBand);
    this.input.connect(this.mBand);
    this.input.connect(this.hBand);

    this.hBand.connect(this.hInvert);
    this.lBand.connect(this.lInvert);

    this.hInvert.connect(this.mBand);
    this.lInvert.connect(this.mBand);

    this.lGain = context.createGain();
    this.mGain = context.createGain();
    this.hGain = context.createGain();

    this.lGain.gain.value = validate(this.meta.low.min, options.low, this.meta.low.max) || this.meta.low.defaultValue;
    this.mGain.gain.value = validate(this.meta.mid.min, options.mid, this.meta.mid.max) || this.meta.mid.defaultValue;
    this.hGain.gain.value = validate(this.meta.high.min, options.high, this.meta.high.max) || this.meta.high.defaultValue;

    this.lBand.connect(this.lGain);
    this.mBand.connect(this.mGain);
    this.hBand.connect(this.hGain);

    this.lGain.connect(this.output);
    this.mGain.connect(this.output);
    this.hGain.connect(this.output);
  }

  updateParams(options) {
    if (options.low) {
      this.lGain.gain.value = validate(this.meta.low.min, options.low, this.meta.low.max);
    }
    if (options.mid) {
      this.mGain.gain.value = validate(this.meta.mid.min, options.mid, this.meta.mid.max);
    }
    if (options.high) {
      this.hGain.gain.value = validate(this.meta.high.min, options.high, this.meta.high.max);
    }
  }

  connect(dest) {
    this.output.connect(dest);
  }

  disconnect() {
    this.output.disconnect();
  }

  meta = {
    low: {
      min: 0,
      max: 1,
      defaultValue: 0.5,
      type: "float"
    },
    mid: {
      min: 0,
      max: 1,
      defaultValue: 0.5,
      type: "float"
    },
    high: {
      min: 0,
      max: 1,
      defaultValue: 0.5,
      type: "float"
    }
  }
}
