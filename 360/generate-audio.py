#!/usr/bin/env python3
"""Regenerate the local spatializable speech samples using macOS Samantha."""
from array import array
from pathlib import Path
import math
import subprocess
import tempfile
import wave

DESTINATION = Path(__file__).parent / 'audio'
WORDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve']
PHRASES = {f'clock-{i + 1}': f"{word} o'clock" for i, word in enumerate(WORDS)}
PHRASES.update(dict(zip([f'distance-{i}' for i in range(1, 6)],
    ['Half a metre', 'One metre', 'One point five metres', 'Two metres', 'Two point five metres'])))

DESTINATION.mkdir(exist_ok=True)
for name, phrase in PHRASES.items():
    with tempfile.TemporaryDirectory() as folder:
        aiff, wav = Path(folder) / 'speech.aiff', Path(folder) / 'speech.wav'
        subprocess.run(['/usr/bin/say', '-v', 'Samantha', '-r', '175', '-o', str(aiff), phrase], check=True)
        subprocess.run(['/usr/bin/afconvert', '-f', 'WAVE', '-d', 'LEI16@24000', str(aiff), str(wav)], check=True)
        with wave.open(str(wav), 'rb') as sound:
            data = array('h', sound.readframes(sound.getnframes()))
        peak = max(abs(value) for value in data)
        active = [i for i, value in enumerate(data) if abs(value) > max(100, peak * 0.008)]
        if not active:
            raise ValueError(f'Empty synthesized speech: {name}')
        data = data[max(0, active[0] - 480):min(len(data), active[-1] + 481)]
        rms = math.sqrt(sum(value * value for value in data) / len(data))
        gain = min(0.12 * 32767 / rms, 0.9 * 32767 / max(abs(value) for value in data))
        for i in range(len(data)):
            fade = min(1, i / 120, (len(data) - i - 1) / 120)
            data[i] = round(data[i] * gain * fade)
        with wave.open(str(DESTINATION / f'{name}.wav'), 'wb') as result:
            result.setnchannels(1); result.setsampwidth(2); result.setframerate(24000)
            result.writeframes(data.tobytes())
        print(f'{name}: {len(data) / 24000:.3f}s')
