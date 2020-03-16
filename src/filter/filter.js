export default class Filter {
  constructor (context, options) {
    this.context = context;
    this.input = context.createGain();
    this.output = context.createGain();
    this.filter = context.createBiquadFilter();
    this.dry = context.createGain();
    this.wet = context.createGain();
    this.filter.type = options.type || this.meta.type.defaultValue;
    this.filter.frequency.value = Math.min(Math.max(this.meta.frequency.min, options.frequency), this.meta.frequency.max) || this.meta.frequency.defaultValue;
    this.filter.Q.value = Math.min(Math.max(this.meta.quality.min, options.quality), this.meta.quality.max)*30 || this.meta.quality.defaultValue;
    this.filter.gain.value = Math.min(Math.max(this.meta.gain.min, options.gain), this.meta.gain.max) || this.meta.gain.defaultValue;
    this.wet.gain.value = Math.min(Math.max(this.meta.wet.min, options.wet), this.meta.wet.max) || this.meta.wet.defaultValue;
    this.dry.gain.value = Math.min(Math.max(this.meta.dry.min, options.dry), this.meta.dry.max) || this.meta.dry.defaultValue;
    this.input.connect(this.filter);
    this.filter.connect(this.wet);
    this.wet.connect(this.output);

    this.input.connect(this.dry);
    this.dry.connect(this.output);
  }

  updateParams(options) {
    this.filter.frequency.setValueAtTime(Math.min(Math.max(this.meta.frequency.min, options.frequency), this.meta.frequency.max), 0);
    this.filter.Q.setValueAtTime(Math.min(Math.max(this.meta.quality.min, options.quality), this.meta.quality.max)*30, 0);
    this.filter.gain.setValueAtTime(Math.min(Math.max(this.meta.gain.min, options.gain), this.meta.gain.max), 0);
    this.wet.gain.setValueAtTime(Math.min(Math.max(this.meta.wet.min, options.wet), this.meta.wet.max), 0);
    this.dry.gain.setValueAtTime(Math.min(Math.max(this.meta.dry.min, options.dry), this.meta.dry.max), 0);
  }

  connect(dest) {
    this.output.connect(dest);
  }

  disconnect() {
    this.output.disconnect();
  }

  meta = {
    type: {
      defaultValue: 'lowpass',
      type: "string"
    },
    frequency: {
      min: 0,
      max: 22050,
      defaultValue: 8000,
      type: "float"
    },
    quality: {
      min: 0.0001,
      max: 1000,
      defaultValue: 1.0,
      type: "float"
    },
    gain: {
      min: -40,
      max: 40,
      defaultValue: 1,
      type: "float"
    },
    wet: {
      min: 0,
      max: 1,
      defaultValue: 1,
      type: "float"
    },
    dry: {
      min: 0,
      max: 1,
      defaultValue: 0,
      type: "float"
    }
  }
}
