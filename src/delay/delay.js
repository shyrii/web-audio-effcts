import { Filter }  from '../filter';

export default class Delay {
  constructor(context, options) {
    this.input = context.createGain();
    this.output = context.createGain();

    this.type = Math.min(Math.max(this.meta.type.min, options.type), this.meta.type.max) || this.meta.type.defaultValue;
    this.delay = Math.min(Math.max(this.meta.delay.min, options.delay), this.meta.delay.max) || this.meta.delay.defaultValue;
    this.feedback = Math.min(Math.max(this.meta.feedback.min, options.feedback), this.meta.feedback.max) || this.meta.feedback.defaultValue;
    this.cutoff = Math.min(Math.max(this.meta.cutoff.min, options.cutoff), this.meta.cutoff.max) || this.meta.cutoff.defaultValue;
    this.dry = Math.min(Math.max(this.meta.dry.min, options.dry), this.meta.dry.max) || this.meta.dry.defaultValue;
    this.offset = Math.min(Math.max(this.meta.offset.min, options.offset), this.meta.offset.max) || this.meta.offset.defaultValue;

    this.split = context.createChannelSplitter(2);
    this.merge = context.createChannelMerger(2);
    this.leftDelay = context.createDelay();
    this.rightDelay = context.createDelay();
    this.leftGain = context.createGain();
    this.rightGain = context.createGain();
    this.leftFilter = new Filter(context, {frequency: this.cutoff});
    this.rightFilter = new Filter(context, {frequency: this.cutoff});
    this.dry = context.createGain();

    this.leftDelay.delayTime.value = this.delay;
    this.rightDelay.delayTime.value = this.delay;
    this.leftGain.gain.value = this.feedback;
    this.rightGain.gain.value = this.feedback;

    this.input.connect(this.split);
    this.leftDelay.connect(this.leftGain);
    this.rightDelay.connect(this.rightGain);
    this.leftGain.connect(this.leftFilter.input);
    this.rightGain.connect(this.rightFilter.input);
    this.merge.connect(this.output);
    this.route();
    this.input.connect(this.dry);
    this.dry.connect(this.output);


  }

  route() {
    this.split.disconnect();
    this.leftFilter.disconnect();
    this.rightFilter.disconnect();
    this.leftFilter.connect(this.merge, 0, 0);
    this.rightFilter.connect(this.merge, 0, 1);
    this[["routeNormal", "routeInverted", "routePingPong"][this.type]]();
  }

  routeNormal() {
    this.split.connect(this.leftDelay, 0);
    this.split.connect(this.rightDelay, 1);
    this.leftFilter.connect(this.leftDelay);
    this.rightFilter.connect(this.rightDelay);
  }

  routeInverted() {
    this.split.connect(this.leftDelay, 1);
    this.split.connect(this.rightDelay, 0);
    this.leftFilter.connect(this.leftDelay);
    this.rightFilter.connect(this.rightDelay);
  }

  routePingPong() {
    this.split.connect(this.leftDelay, 0);
    this.split.connect(this.rightDelay, 1);
    this.leftFilter.connect(this.rightDelay);
    this.rightFilter.connect(this.leftDelay);
  }

  updateParams(options) {
    this.type = Math.min(Math.max(this.meta.type.min, options.type), this.meta.type.max);
    this.route();
    this.leftDelay.delayTime.setValueAtTime(Math.min(Math.max(this.meta.delay.min, options.delay), this.meta.delay.max), 0);
    this.rightDelay.delayTime.setValueAtTime(Math.min(Math.max(this.meta.delay.min, options.delay), this.meta.delay.max), 0);
    this.leftGain.gain.setValueAtTime(Math.min(Math.max(this.meta.feedback.min, options.feedback), this.meta.feedback.max), 0);
    this.rightGain.gain.setValueAtTime(Math.min(Math.max(this.meta.feedback.min, options.feedback), this.meta.feedback.max), 0);
    this.leftFilter.frequency = Math.min(Math.max(this.meta.cutoff.min, options.cutoff), this.meta.cutoff.max);
    this.rightFilter.frequency = Math.min(Math.max(this.meta.cutoff.min, options.cutoff), this.meta.cutoff.max);
    this.dry.gain.setValueAtTime(Math.min(Math.max(this.meta.dry.min, options.dry), this.meta.dry.max), 0);
    let offsetTime = this.delay + options.offset;
    if (this.offset < 0) {
      this.leftDelay.delayTime.setValueAtTime(offsetTime, 0);
      this.rightDelay.delayTime.setValueAtTime(this.delay, 0);
    }else {
      this.leftDelay.delayTime.setValueAtTime(this.delay, 0);
      this.rightDelay.delayTime.setValueAtTime(offsetTime, 0);
    }
  }

  connect(dest) {
    this.output.connect(dest);
  }

  disconnect() {
    this.output.disconnect();
  }

  meta = {
    type: {
      min: 0,
      max: 2,
      defaultValue: 0,
      type: "int"
    },
    delay: {
      min: 0,
      max: 10,
      defaultValue: 1.0,
      type: "float"
    },
    feedback: {
      min: 0,
      max: 1,
      defaultValue: 0.5,
      type: "float"
    },
    cutoff: {
      min: 0,
      max: 22050,
      defaultValue: 8000,
      type: "float"
    },
    offset: {
      min: -0.5,
      max: 0.5,
      defaultValue: 0,
      type: "float"
    },
    dry: {
      min: 0,
      max: 1.0,
      defaultValue: 1,
      type: "float"
    }
  }
}
