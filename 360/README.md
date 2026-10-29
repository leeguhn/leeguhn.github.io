# Study 1 cue test bed

A standalone, local demonstration of the current Study 1 cue combinations.
The supplied one- and two-object mockups define the layout. Imported from `7102.ETRI_2026` branch `study1-web`, commit `5352123`.
This replaces the active interface only. The earlier sandbox code and preserved
`v1.0/` remain in this folder and Git history; they are not loaded by this page.

## Run

```sh
cd web-prototype
npm run dev
```

Open <http://127.0.0.1:18791/>. No dependency installation or external service is
required. Use HTTP rather than opening the HTML file directly, so the browser can
load the JavaScript modules and bundled speech recordings.

## Controls

- Click each bottom button to cycle cue design, trigger, object count and schedule.
- Q turns left; E turns right. Holding a key turns continuously. Arrow keys also work.
- Click the speaker to enable sound. It is red only while an object cue is sounding.
- Automatic playback repeats after each complete cycle. Click the speaker or press
  Space to pause/resume. Requested playback occurs only on a speaker click or Space;
  additional requests during playback are ignored.
- Click the inset to swap radar and first-person views. R also swaps them.
- Shuffle samples all four properties and new object positions, then resets the
  head direction to radar-up. A randomly sampled property may retain its old value.
- Scheduling is disabled with one object; its previous choice returns with two or
  three. The 20 distinct study combinations are available.

## Scene and sound

Every scene contains one, two or three equal-size cylinders: 0.8 m high, 0.52 m in
diameter. Colors identify their positions visually; color does not change sound.
The five radar rings are 0.5 m apart, covering 0.5–2.5 m. Shuffled cylinders can
appear anywhere around the listener and are placed without intersecting.

The scene is stationary. World +Z is radar-up / initial forward; +X is right.
Head rotation changes the camera and the single audio listener, never the objects.
The POV uses upright, flat-filled projected cylinders to match the reference
drawing, with apparent size varying by distance. It is a diagram-style preview,
not a physically complete scene renderer.

Both cue designs use the browser's HRTF renderer and fixed world-space emitters.
Spoken cues say the head-relative clock bearing and distance in metres. Labels
are sampled at each message onset; spatialization continues updating during head
turns. Nonverbal cues use pitch and level for distance. There are no sweeps or
object-category sounds. Simultaneous speech actually overlaps: the bundled WAV
recordings are played through Web Audio, not a serialized speech-synthesis queue.

See [AUDIO.md](AUDIO.md) for exact provisional audio settings and asset generation.
The interface waits for an explicit user gesture before enabling sound, as required
by browser autoplay policies. Automatic mode uses a 900 ms pause after a complete
cycle. These are demo settings, not calibrated or frozen participant-study values.
No response task, scoring, participant logging or questionnaires are implemented.

## Verification

```sh
npm test
```

Model and audio tests cover world coordinates, all 20 combinations, randomized
ring placement, scheduling, distance coding and cancellation. Browser checks cover
the controls, view swap, speaker states, actual concurrent speech start times,
loading cancellation, missing-audio errors and responsive layout. Perceptual
front/back accuracy and headphone loudness still require listening and piloting.

Shuffle and speaker SVGs are vendored Font Awesome Free icons; their license is
included in `assets/icons/LICENSE.txt`. All runtime assets are local.

## Study revision and publishing

This demo follows the recent Study 1 revisions: verbal/nonverbal cues, automatic/
requested presentation, 1–3 objects and sequential/simultaneous scheduling. It is
not an implementation of the older coverage-by-risk-filtering protocol in
`docs/research/03-fixed-experimental-design.md`. That document has not been
rewritten or treated as a frozen specification for this demo. The retained sweep
sandbox uses its original frequency defaults; the new nonverbal cue spans
260–1200 Hz. Both new cue designs are spatialized with HRTF.

The deployed copy lives in `leeguhn.github.io/360/`. Publishing requires copying
the interface and local assets there and pushing that repository’s `main` branch;
pushing `etri_360` alone does not trigger the website workflow.
