# Audio implementation

This is an audible demonstration, not a calibrated participant-study renderer.
All numerical sound settings are provisional. Use headphones at a modest volume.

`CueAudio` owns one Web Audio `AudioContext` and its one listener. Every current
object gets a fixed-world `PannerNode` using the browser's `HRTF` panning model.
The listener faces `(sin(heading), 0, -cos(heading))`; world object `(x, z)` is
mapped to audio `(x, 0, -z)`. Head rotation updates the listener only. Audio is
available around the full circle, including objects outside the visible POV.

## Sound designs

- **Verbal:** a clock direction plus distance in metres. The clock direction is
  sampled at each object's message onset. The message is not rewritten midway
  through an utterance, but head-tracked spatialization continues. Speech keeps
  its natural pitch and has no distance-based gain or rate code.
- **Nonverbal:** a 0.18-second harmonic beep. Distances 0.5, 1, 1.5, 2 and 2.5 m map
  to five fixed pitches: 1200, 819, 559, 381 and 260 Hz. Values are rounded to
  the nearest half-metre level, with no interpolation. Source gain remains 0.2
  across all distances; loudness does not encode distance. All objects use
  the same fixed harmonic mixture; repetition rate is not a distance code.
- **Sequential:** whole object messages play one at a time with 0.18 seconds
  between messages. Each speech label uses the head direction at its own onset.
- **Simultaneous:** all object sources start at one shared Web Audio time. The
  speech streams actually overlap; this does not use `speechSynthesis`, whose
  queue would serialize utterances. Simultaneous speech may be hard to separate.

Distance attenuation inside `PannerNode` is disabled, preventing an extra distance
code from being added to speech or a second distance code for the beep. Overall
master gain is 0.4. These settings are not perceptually equalized and do not imply
that speech and beeps have equal information precision or loudness.

## Local speech assets

The 17 mono WAV files in `audio/` contain twelve clock directions and five distance
phrases (0.5, 1, 1.5, 2 and 2.5 m). They were generated locally using macOS Samantha
at 175 words/minute, trimmed, and RMS-normalized. Web Audio resamples the 24 kHz
PCM recordings to the context's rate. A message joins one clock recording to one
distance recording with 55 ms of silence. No speech service/network API is used.

Regenerate on macOS with `python3 generate-audio.py` from this directory. The
browser must load the folder through HTTP; opening `index.html` as a `file:` URL
will not reliably allow the speech sample requests.

## Controller API

```js
const audio = new CueAudio({
  onActivity: objectIds => { /* currently sounding objects, [] during silence */ },
  onError: message => { /* report the error to the interface */ },
});
await audio.unlock(); // invoke from a user click/key to satisfy autoplay policy
audio.update(state); // also invoke as the head rotates
await audio.playCycle(state); // returns false if already busy or cancelled
audio.stop(); // abort playback/loading continuation and clear activity
```

`playing` includes loading and the silent gaps within an active cycle, so it can
guard repeat requests. `onActivity` indicates source sound periods and is the
appropriate input for the red speaker icon. `cycleDuration` estimates the current
complete sound window; it is not an automatic-repeat interval. The UI owns the
automatic/requested trigger policy. `stop()` invalidates old asynchronous cycles
so a mode change or shuffle cannot start an obsolete queued sound.

Speech source messages last approximately 1.44–2.42 seconds, depending on the
clock and distance phrases. Moving the head can change the next label and thus
slightly change sequential-cycle length. No timing here is a study deadline.

The Node tests cover distance mapping, scheduling, coordinates, duration and
cancellation while browser unlock/loading is pending. They do not validate human
localization performance, headphone fit, or physical loudness.

## Revised study rehearsal

The five pitches are log-spaced demonstration values within the existing
260–1200 Hz band. Equal source gain does not guarantee equal perceived loudness;
headphone calibration remains necessary. Learning examples, no-feedback checks
and random trials all use this same mapping and the same speech buffers.
Requested trials do not receive an automatic first readout: press Space or the
speaker. Automatic trials repeat after the existing 900 ms cycle gap.

The response UI and review timer do not move emitters or change their distance
code. Mode switches and trial transitions cancel existing sources before new
ones start. Per-trial radar feedback is a rehearsal feature, not the participant
protocol. Numeric settings and learning thresholds remain provisional.
