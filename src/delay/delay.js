import { Filter }  from '../filter';
import { validate } from '../utils/validate';

export default class Delay {
  constructor(context, options) {
    this.input = context.createGain();
    this.output = context.createGain();

    this.type = validate(this.meta.type.min, options.type, this.meta.type.max) || this.meta.type.defaultValue;
    this.delayLeft = validate(this.meta.delayLeft.min, options.delayLeft, this.meta.delayLeft.max) || this.meta.delayLeft.defaultValue;
    this.delayRight = validate(this.meta.delayRight.min, options.delayRight, this.meta.delayRight.max) || this.meta.delayRight.defaultValue;
    this.feedback = validate(this.meta.feedback.min, options.feedback, this.meta.feedback.max) || this.meta.feedback.defaultValue;
    this.dry = validate(this.meta.dry.min, options.dry, this.meta.dry.max) || this.meta.dry.defaultValue;

    this.split = context.createChannelSplitter(2);
    this.merge = context.createChannelMerger(2);
    this.leftDelay = context.createDelay();
    this.rightDelay = context.createDelay();
    this.leftGain = context.createGain();
    this.rightGain = context.createGain();
    // this.leftFilter = new Filter(context, {frequency: this.cutoff});
    // this.rightFilter = new Filter(context, {frequency: this.cutoff});
    this.dry = context.createGain();

    this.leftDelay.delayTime.value = this.delayLeft;
    this.rightDelay.delayTime.value = this.delayRight;
    this.leftGain.gain.value = this.feedback;
    this.rightGain.gain.value = this.feedback;

    this.input.connect(this.split);
    this.leftDelay.connect(this.leftGain);
    this.rightDelay.connect(this.rightGain);
    // this.leftGain.connect(this.leftFilter.input);
    // this.rightGain.connect(this.rightFilter.input);
    this.merge.connect(this.output);
    this.route();
    this.input.connect(this.dry);
    this.dry.connect(this.output);


  }

  route() {
    this.split.disconnect();
    this.leftGain.disconnect();
    this.rightGain.disconnect();
    this.leftGain.connect(this.merge, 0, 0);
    this.rightGain.connect(this.merge, 0, 1);
    this[["routeNormal", "routeInverted", "routePingPong"][this.type]]();
  }

  routeNormal() {
    this.split.connect(this.leftDelay, 0);
    this.split.connect(this.rightDelay, 1);
    this.leftGain.connect(this.leftDelay);
    this.rightGain.connect(this.rightDelay);
  }

  routeInverted() {
    this.split.connect(this.leftDelay, 1);
    this.split.connect(this.rightDelay, 0);
    this.leftGain.connect(this.leftDelay);
    this.rightGain.connect(this.rightDelay);
  }

  routePingPong() {
    this.split.connect(this.leftDelay, 0);
    this.split.connect(this.rightDelay, 1);
    this.leftGain.connect(this.rightDelay);
    this.rightGain.connect(this.leftDelay);
  }

  updateParams(options) {
    if (options.type) {
      this.type = validate(this.meta.type.min, options.type, this.meta.type.max);
      this.route();
    }
    if (options.delayLeft) {
      this.leftDelay.delayTime.setValueAtTime(validate(this.meta.delayLeft.min, options.delayLeft, this.meta.delayLeft.max), 0);
    }
    if (options.delayRight) {
      this.rightDelay.delayTime.setValueAtTime(validate(this.meta.delayRight.min, options.delayRight, this.meta.delayRight.max), 0);
    }
    if (options.feedback) {
      this.leftGain.gain.setValueAtTime(validate(this.meta.feedback.min, options.feedback, this.meta.feedback.max), 0);
      this.rightGain.gain.setValueAtTime(validate(this.meta.feedback.min, options.feedback, this.meta.feedback.max), 0);
    }
    if (options.dry) {
      this.dry.gain.setValueAtTime(validate(this.meta.dry.min, options.dry, this.meta.dry.max), 0);
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
    delayLeft: {
      min: 0,
      max: 0.5,
      defaultValue: 0.2,
      type: "float"
    },
    delayRight: {
      min: 0,
      max: 0.5,
      defaultValue: 0.2,
      type: "float"
    },
    feedback: {
      min: 0,
      max: 1,
      defaultValue: 0.5,
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
