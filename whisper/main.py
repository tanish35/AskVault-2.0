from fastapi import FastAPI, UploadFile, File, HTTPException
from faster_whisper import WhisperModel
import tempfile
import os
import subprocess

app = FastAPI()

model = WhisperModel(
    "small",
    device="cpu",
    compute_type="int8"
)

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False) as raw:
        raw_path = raw.name
        raw.write(await file.read())

    wav_path = raw_path + "_16k.wav"

    try:
        subprocess.run(
            [
                "ffmpeg", "-y",
                "-loglevel", "error",
                "-i", raw_path,    
                "-ar", "16000",
                "-ac", "1",
                "-f", "wav",
                wav_path
            ],
            check=True
        )
        segments, info = model.transcribe(
            wav_path,
            language="en",
            vad_filter=False,
            beam_size=5
        )

        text = " ".join(s.text for s in segments).strip()

        return {
            "text": text,
            "language": info.language,
        }

    except subprocess.CalledProcessError:
        raise HTTPException(
            status_code=400,
            detail="Invalid audio format (ffmpeg failed)"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        for p in (raw_path, wav_path):
            if os.path.exists(p):
                os.remove(p)
