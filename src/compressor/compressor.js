export default class Compressor {
  constructor (context, options) {
    this.context = context;
    this.input = context.createGain();
    this.output = context.createGain();
    this.compressor = context.createDynamicsCompressor();
    this.gainNode = context.createGain();

    this.compressor.attack.value = Math.min(Math.max(this.meta.attack.min, options.attack), this.meta.attack.max) || this.meta.attack.defaultValue;
    this.compressor.ratio.value = Math.min(Math.max(this.meta.ratio.min, options.ratio), this.meta.ratio.max) || this.meta.ratio.defaultValue;
    this.compressor.release.value = Math.min(Math.max(this.meta.release.min, options.release), this.meta.release.max) || this.meta.release.defaultValue;
    this.compressor.threshold.value = Math.min(Math.max(this.meta.threshold.min, options.threshold), this.meta.threshold.max) || this.meta.threshold.defaultValue;
    this.gainNode.gain.value = Math.min(Math.max(this.meta.gain.min, options.gain), this.meta.gain.max) || this.meta.gain.defaultValue;

    this.input.connect(this.gainNode);
    this.gainNode.connect(this.compressor);
    this.compressor.connect(this.output);
  }

  updateParams(options) {
    this.compressor.attack.value = Math.min(Math.max(this.meta.attack.min, options.attack), this.meta.attack.max);
    this.compressor.ratio.value = Math.min(Math.max(this.meta.ratio.min, options.ratio), this.meta.ratio.max);
    this.compressor.release.value = Math.min(Math.max(this.meta.release.min, options.release), this.meta.release.max);
    this.compressor.threshold.value = Math.min(Math.max(this.meta.threshold.min, options.threshold), this.meta.threshold.max);
    this.gainNode.gain.value = Math.min(Math.max(this.meta.gain.min, options.gain), this.meta.gain.max);
  }

  connect(dest) {
    this.output.connect(dest);
  }

  disconnect() {
    this.output.disconnect();
  }

  meta = {
    attack: {
      min: 0,
      max: 1,
      defaultValue: 0.3,
      type: "float"
    },
    release: {
      min: 0,
      max: 1,
      defaultValue: 0.15,
      type: "float"
    },
    ratio: {
      min: 1,
      max: 20,
      defaultValue: 10,
      type: "float"
    },
    threshold: {
      min: -100,
      max: 0,
      defaultValue: -50,
      type: "float"
    },
    gain: {
      min: 0,
      max: 1,
      defaultValue: 0.3,
      type: "float"
    }
  }
}
