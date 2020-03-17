# web-audio-effcts
A simple delay/equalizer/filter/reverb effect module for the Web Audio API.

# Delay(context, options)
Instantiate a Delay effect module. Expects an AudioContext as the first parameter.
## options
- type (0: normal, 1: inverted, 2: ping pong)
- delay (float: 0-10)
- feedback (float: 0-1)
- cutoff (float: 0-22050)
- offset (float: -0.5-0.5)
- dry (float: 0-1)

# Filter(context, options)
Instantiate a Filter effect module. Expects an AudioContext as the first parameter.
## options
- type (string: 'lowpass'/'highpass')
- frequency (float: 0-22050)
- quality (float: 0.0001-1000)
- gain (float: -40-40)
- wet (float: 0-1)
- dry (float: 0-1)

# Reverb(context, options)
Instantiate a Reverb effect module. Expects an AudioContext as the first parameter.
## options
- seconds (float: 1-50)
- decay (float: 0-100)
- delay (float: 0-100)
- reverse (boolean)

# Equalizer(context, options)
Instantiate a Equalizer effect module. Expects an AudioContext as the first parameter.
## options
- low (float: 0-1)
- mid (float: 0-1)
- high (float: 0-1)