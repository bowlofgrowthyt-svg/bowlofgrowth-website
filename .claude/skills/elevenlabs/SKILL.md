---
name: elevenlabs
description: Use the ElevenLabs MCP server for voice + audio tasks - text-to-speech, voice cloning/design, speech-to-text transcription, sound effects, voice changer, dubbing, isolating audio, and managing voices/history. TRIGGER when the user asks to generate speech/narration/voiceover, clone or design a voice, transcribe audio, create sound effects, dub a video, isolate vocals, or browse/manage their ElevenLabs library.
---

# ElevenLabs

This project has the official `elevenlabs-mcp` server wired in (`.mcp.json`). Tools appear under the `mcp__elevenlabs__*` prefix.

## Setup check

The server needs `ELEVENLABS_API_KEY` exported in the shell that launched Claude Code. If tools return auth errors, ask the user to:

```sh
export ELEVENLABS_API_KEY=sk_...
```

then restart the Claude Code session.

## Common workflows

- **Text-to-speech** - call the TTS tool with `text` and a `voice_id` (or `voice_name`). Save the returned audio to `public/audio/` for web use, or to a path the user specifies. Default to MP3 unless asked otherwise.
- **List/search voices** - use the list-voices tool before TTS when the user hasn't named a voice; show 3-5 suggestions with a one-line description each, don't paginate hundreds.
- **Voice design / cloning** - confirm consent before cloning; the user must own or have rights to the source audio. Use the instant-voice-clone tool for short samples, professional-voice-clone for higher fidelity.
- **Speech-to-text** - upload the file path; return the transcript inline if short, else write to a file.
- **Sound effects** - use the sound-effects tool with a short prompt + duration; clamp duration to <=22s.
- **Dubbing** - long-running; report the job id and poll status rather than blocking.

## Output handling

- For web projects (Next.js here), save audio under `public/audio/` and reference via `/audio/filename.mp3`.
- Never commit large audio files without asking. Add a `.gitignore` entry if generating many.
- Print the file path and a one-line summary; don't dump base64 into chat.

## Cost awareness

ElevenLabs bills per character (TTS) and per second (STT/dubbing). For long generations (>1000 chars or >60s), confirm with the user before running.
