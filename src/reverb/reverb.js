export default class Reverb {
    constructor(context, options) {
        this.context = context;
        this.input = this.dry = this.wet = context.createGain();
        this.output = context.createGain();
        this.convolver = context.createConvolver();
        this.filter = context.createBiquadFilter();

        this.input.connect(this.dry);
        this.dry.connect(this.output);

        this.input.connect(this.convolver);
        this.convolver.connect(this.filter);
        this.filter.connect(this.wet);
        this.wet.connect(this.output);

        this.wet.gain.value =  0.5;
        this.dry.gain.value = 0.5;
        this.filter.frequency.value = 4000;
        this.filter.type = 'lowpass';
        this.building = false;

        this.seconds = Math.min(Math.max(this.meta.seconds.min, options.seconds), this.meta.seconds.max) || this.meta.seconds.defaultValue;
        this.decay = Math.min(Math.max(this.meta.decay.min, options.decay), this.meta.decay.max) || this.meta.decay.defaultValue;
        this.delay = Math.min(Math.max(this.meta.delay.min, options.delay), this.meta.delay.max) || this.meta.delay.defaultValue;
        this.reverse = Math.min(Math.max(this.meta.reverse.min, options.reverse), this.meta.reverse.max) || this.meta.reverse.defaultValue;
        this.buildImpulse();
    }

    updateParams(options) {
        this.seconds = Math.min(Math.max(this.meta.seconds.min, options.seconds), this.meta.seconds.max);
        this.decay = Math.min(Math.max(this.meta.decay.min, options.decay), this.meta.decay.max);
        this.delay = Math.min(Math.max(this.meta.delay.min, options.delay), this.meta.delay.max);
        this.reverse = Math.min(Math.max(this.meta.reverse.min, options.reverse), this.meta.reverse.max);
        this.buildImpulse();
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
            , delayDuration = rate * this.delay
            , impulse = this.context.createBuffer(2, length, rate)
            // , impulseL = impulse.getChannelData(0)
            // , impulseR = impulse.getChannelData(1)
            , impulseL = new Float32Array(length)
            , impulseR = new Float32Array(length)
            , n, i;

        for (i = 0; i < length; i++) {
            if (i < delayDuration) {
                // Delay Effect
                impulseL[i] = 0;
                impulseR[i] = 0;
                n = this.reverse ? length - (i - delayDuration) : i - delayDuration;
              } else {
                n = this.reverse ? length - i : i;
              }
            impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, this.decay);
            impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, this.decay);
        }

        impulse.getChannelData(0).set(impulseL);
        impulse.getChannelData(1).set(impulseR);
        this.convolver.buffer = impulse;
        
    }

    meta = {
        seconds: {
            min: 1,
            max: 50,
            defaultValue: '3',
            type: "float"
        },
        decay: {
            min: 0,
            max: 100,
            defaultValue: 2,
            type: "float"
        },
        delay: {
            min: 0,
            max: 100,
            defaultValue: 2,
            type: "float"
        },
        reverse: {
            min: 0,
            max: 1,
            defaultValue: 0,
            type: "boolean"
        }
    }
}