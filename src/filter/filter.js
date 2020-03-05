export default class Filter {
  constructor (context, options) {
    this.context = context;
    this.input = context.createGain();
    this.output = context.createGain();
    this.filter = context.createBiquadFilter();
    this.filter.type = options.type || 'lowpass';
    this.filter.frequency.value = options.frequency;
    this.filter.Q.value = options.quality;
    this.input.connect(this.filter);
    this.filter.connect(this.output);
  }

  updateParams(options) {
    this.filter.frequency.value = options.frequency;
    this.filter.Q.value = options.quality;
  }

  connect(dest) {
    this.output.connect(dest);
  }

  disconnect() {
    this.output.disconnect();
  }
}
