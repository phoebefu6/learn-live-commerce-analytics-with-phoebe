# LIVE Commerce Video Analytics - technical-track primary sources

Researched 2026-09-24. Every version below was read from the fetched page on that date; nothing is from memory.
Status legend: VERIFIED = page fetched and the fact read on it. PARTIAL = page fetched, but the specific
fact asked for was not on it (the gap is named). UNVERIFIED = fetch failed twice / not attempted; do not teach
as fact without a second check.

Two surprises worth flagging up front (both read, not guessed):
- The Gemini video docs now use `client.interactions.create(...)` and name `gemini-3.8-flash`; the google-genai
  PyPI README (v2.25.0) still shows `client.models.generate_content()`. Both are live; teach `interactions`
  from the video page and mention the older call.
- `supervision.ByteTrack` is deprecated since 0.28.0 and removed in 0.31.0 (current is 0.30.5). Teach the
  separate `trackers` package (`ByteTrackTracker`) instead.

---

## 1. Media preprocessing

### FFmpeg
| Field | Value | Status |
|---|---|---|
| URL | https://ffmpeg.org/download.html | VERIFIED |
| Version | **9.0.2 "Lei"**, released 2026-09-18 (latest stable, 9.0 branch) | VERIFIED |
| Licence | LGPL 2.1+ / GPL 2+ depending on build flags (not re-read this run) | UNVERIFIED |
| Docs used | https://ffmpeg.org/ffmpeg-formats.html (segment muxer, section 4.73), https://ffmpeg.org/ffmpeg-filters.html (fps filter), https://ffmpeg.org/ffmpeg.html (-ar/-ac/-vn/-ss/-t/-map) | VERIFIED |

**Segment muxer options (read):** `segment_format`, `segment_time` (seconds per segment), `segment_times`
(explicit cut points), `segment_atclocktime`, `segment_clocktime_offset`, `reset_timestamps` (restart each
segment at 0), `segment_list` + `segment_list_type` (csv / m3u8 / ffconcat), `strftime` (time-stamped
filenames), `break_non_keyframes`, `segment_time_delta`, `segment_start_number`.

Example verbatim from the docs:
```
ffmpeg -i in.mkv -c copy -map 0 -f segment -segment_list out.list -segment_time 10 'out-%03d.mkv'
ffmpeg -i in.mkv -c copy -map 0 -f segment -segment_list out.csv -segment_list_type csv -segment_time 10 'out-%03d.mkv'
```
Teaching note (my composition of documented options, not a doc example): stream-copy only cuts at keyframes,
so a 60 s `segment_time` on a live-stream recording will drift unless you either re-encode with
`-force_key_frames "expr:gte(t,n_forced*60)"` or accept `break_non_keyframes`. Add `-reset_timestamps 1`
so each chunk starts at 0 for per-segment analysis.

**Frames at N fps (fps filter, read):** options `fps`, `start_time`, `round`, `eof_action`. Doc example:
`ffmpeg -i input.mov -vf fps=24 output.mov`. For analysis frames the same filter feeds an image sequence:
`ffmpeg -i in.mp4 -vf fps=1 frames/%06d.jpg` (composition). The neighbouring `select` filter exposes a
`scene` score expression usable as a cheap cut detector.

**Audio to 16 kHz mono WAV (options read on ffmpeg.html):** `-ar[:stream] freq` resamples on output,
`-ac[:stream] channels` downmixes, `-vn` drops video, `-c:a` picks the encoder. Composition:
`ffmpeg -i in.mp4 -vn -ac 1 -ar 16000 -c:a pcm_s16le out.wav` (16 kHz mono is what Whisper-family models
expect). `-ss`/`-t`/`-to` clip; put `-ss` before `-i` for fast input seek.

### PySceneDetect
| Field | Value | Status |
|---|---|---|
| URL | https://pypi.org/project/scenedetect/ ; https://www.scenedetect.com/docs/latest/api/detectors.html | VERIFIED |
| Version | **0.7.1**, released 2026-07-22 | VERIFIED |
| Licence | BSD 3-Clause | VERIFIED |

API read from docs 0.7.1:
```python
ContentDetector(threshold=27.0, min_scene_len=15,
                weights=Components(delta_hue=1.0, delta_sat=1.0, delta_lum=1.0, delta_edges=0.0),
                luma_only=False, kernel_size=None, filter_mode=Mode.MERGE)
AdaptiveDetector(adaptive_threshold=3.0, min_scene_len=15, window_width=2, min_content_val=15.0,
                 weights=Components(...), luma_only=False, kernel_size=None)
```
ContentDetector: HSV frame-to-frame difference vs a fixed threshold (fast cuts). AdaptiveDetector: two-pass,
runs ContentDetector scores then a rolling average - fewer false cuts under camera motion, which is the
typical handheld/live-commerce condition. Quick start (PyPI README):
```python
from scenedetect import detect, AdaptiveDetector, split_video_ffmpeg
scene_list = detect('my_video.mp4', AdaptiveDetector())
split_video_ffmpeg('my_video.mp4', scene_list)
```
CLI: `scenedetect -i video.mp4 split-video`.

---

## 2. Detection: product in hand / host on camera / close-up

### Ultralytics YOLO
| Field | Value | Status |
|---|---|---|
| URL | https://pypi.org/project/ultralytics/ ; https://docs.ultralytics.com/models/ ; https://docs.ultralytics.com/models/yolo26/ ; https://docs.ultralytics.com/modes/track/ ; https://www.ultralytics.com/license | VERIFIED |
| Package version | **ultralytics 8.4.161**, released 2026-09-23 | VERIFIED |
| Current model | **YOLO26** (released January 2026) is the flagship - "the latest Ultralytics release and the only one covering all seven tasks". YOLO27 is listed "Coming Soon". YOLO11 and YOLO12 are still documented; docs recommend YOLO26 or YOLO11 for stable production. | VERIFIED |
| Licence | **AGPL-3.0** (code + weights) or paid **Enterprise** licence. Licence page: AGPL fits research, personal and fully open-source use; Enterprise is required for commercial products, closed-source internal tools, SaaS/APIs with a YOLO backend, embedded devices, and custom-trained models in commercial settings. Pricing is quote-based. | VERIFIED |

YOLO26 facts (read): NMS-free end-to-end inference with `nms=False`; COCO mAP n 40.9 / s 48.6 / m 53.1 /
l 55.0 / x 57.5; tasks detect, segment, semantic-seg, depth, classify, pose, OBB. Weights named
`yolo26n.pt` ... `yolo26x.pt`, plus `-seg`, `-pose`, `-cls`, `-obb`, `-depth`.
```python
from ultralytics import YOLO
model = YOLO("yolo26n.pt")
results = model("path/to/bus.jpg")
```
Tracking (modes/track, read): `model.track(source, persist=True, tracker="bytetrack.yaml")`; trackers
shipped: `bytetrack.yaml`, `botsort.yaml`, `ocsort.yaml`, `deepocsort.yaml`, `fasttrack.yaml`,
`tracktrack.yaml` (stated default). IDs via `results[0].boxes.id.int().cpu().tolist()`. YAML fields:
`tracker_type`, `track_high_thresh`, `track_low_thresh`, `track_buffer`, `gmc_method`, `with_reid`,
`proximity_thresh`, `appearance_thresh`.

Open-vocab inside Ultralytics - **YOLOE** (https://docs.ultralytics.com/models/yoloe/, VERIFIED): text
prompts, visual prompts, or prompt-free (4,585-name vocab). Families YOLOE-26 / -11 / -v8; checkpoints
`*-seg.pt` (prompted) and `*-seg-pf.pt` (prompt-free).
```python
from ultralytics import YOLOE
model = YOLOE("yoloe-26s-seg.pt")
model.set_classes(["double-decker bus", "person"])
results = model.predict("bus.jpg")
```
Licence for YOLOE not stated on that page; it ships inside the ultralytics package so the AGPL/Enterprise
terms above apply (PARTIAL - inferred from the package licence).

Teaching mapping: "host on camera" = person class (COCO 0) present; "close-up" = person box area / frame
area above a threshold or pose landmarks missing below the shoulders; "product in hand" = hand landmark
(MediaPipe) inside or adjacent to a product box (YOLOE text prompt with the SKU name) - the zone/line tools
below turn these into counts per segment.

### MediaPipe Tasks
| Field | Value | Status |
|---|---|---|
| URL | https://pypi.org/project/mediapipe/ ; https://github.com/google-ai-edge/mediapipe ; https://developers.google.com/edge/mediapipe/solutions/vision/{object_detector,hand_landmarker,pose_landmarker}/python | VERIFIED (ai.google.dev URL 301-redirects to developers.google.com) |
| Version | **mediapipe 1.0.1**, released 2026-08-14; Python 3.9-3.12; PyPI classifier still says Alpha | VERIFIED |
| Licence | Apache-2.0 | VERIFIED |

API (read): `import mediapipe as mp; from mediapipe.tasks.python import vision`. Every task has
`XOptions(base_options=mp.tasks.BaseOptions(model_asset_path=...), running_mode=...)`, running modes
`IMAGE`, `VIDEO`, `LIVE_STREAM`, and methods `detect(mp_image)`, `detect_for_video(mp_image, timestamp_ms)`,
`detect_async(mp_image, timestamp_ms)`.
- **ObjectDetector** / `ObjectDetectorOptions(max_results=...)`; example model
  `lite-model_efficientdet_lite0_detection_metadata_1.tflite` (EfficientDet-Lite family).
- **HandLandmarker** / `HandLandmarkerOptions(num_hands=1, min_hand_detection_confidence=0.5,
  min_hand_presence_confidence=0.5, min_tracking_confidence=0.5)`; output per hand: `handedness`,
  `hand_landmarks` (21 points, normalised x,y + z), `hand_world_landmarks` (metres). Model is a `.task` file.
- **PoseLandmarker** / `PoseLandmarkerOptions(num_poses=1, output_segmentation_masks=False,
  min_pose_detection_confidence=0.5, min_pose_presence_confidence=0.5, min_tracking_confidence=0.5,
  result_callback=...)`; 33 landmarks with visibility + presence. Lite/full/heavy variant names were not on
  the fetched page (PARTIAL).
```python
options = mp.tasks.vision.ObjectDetectorOptions(
    base_options=mp.tasks.BaseOptions(model_asset_path='/path/to/model.tflite'),
    running_mode=mp.tasks.vision.RunningMode.VIDEO, max_results=5)
with mp.tasks.vision.ObjectDetector.create_from_options(options) as detector:
    result = detector.detect_for_video(mp_image, frame_timestamp_ms)
```

### Roboflow supervision (+ trackers)
| Field | Value | Status |
|---|---|---|
| URL | https://pypi.org/project/supervision/ ; https://supervision.roboflow.com/latest/detection/tools/polygon_zone/ ; .../line_zone/ ; https://supervision.roboflow.com/latest/trackers/ | VERIFIED |
| Version | **supervision 0.30.5**, released 2026-09-22; Python >= 3.10 | VERIFIED |
| Licence | MIT | VERIFIED |
| trackers | https://trackers.roboflow.com/latest/ ; https://pypi.org/pypi/trackers/json - **trackers 2.6.0**, 2026-08-06, Apache-2.0 | VERIFIED |

Zone / line API (read):
```python
PolygonZone(polygon: NDArray[int64], triggering_anchors=(Position.BOTTOM_CENTER,), require_all_anchors=True)
zone.trigger(detections) -> NDArray[bool]      # zone.current_count
PolygonZoneAnnotator(zone, color=Color.WHITE, thickness=2, text_color=Color.BLACK, text_scale=0.5,
                     text_thickness=1, text_padding=10, display_in_zone_count=True, opacity=0)

LineZone(start: Point, end: Point,
         triggering_anchors=(TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT), minimum_crossing_threshold=1)
crossed_in, crossed_out = line_zone.trigger(detections)   # needs detections.tracker_id
line_zone.in_count, .out_count, .in_count_per_class, .out_count_per_class
```
Example (docs):
```python
polygon_zone = sv.PolygonZone(polygon=np.array([[100,200],[200,100],[300,200],[200,300]]))
is_in_zone = polygon_zone.trigger(sv.Detections(xyxy=np.array([[180,100,220,200],[400,400,450,500]])))
# array([True, False]); polygon_zone.current_count == 1
```
Tracking: `sv.ByteTrack(track_activation_threshold=0.25, lost_track_buffer=30, minimum_matching_threshold=0.8,
frame_rate=30, minimum_consecutive_frames=1)` with `tracker.update_with_detections(detections)` - **deprecated
since 0.28.0, removed in 0.31.0**. Replacement:
```python
from trackers import ByteTrackTracker
tracker = ByteTrackTracker(); tracked = tracker.update(detections)   # detections: sv.Detections
```
trackers ships SORT, ByteTrack, OC-SORT, BoT-SORT, C-BIoU, McByte.

### Open-vocabulary route
| Model | URL | Licence | Current? | Status |
|---|---|---|---|---|
| OWLv2 | https://huggingface.co/google/owlv2-base-patch16-ensemble | Apache-2.0 | Released June 2023; still the Google zero-shot baseline | VERIFIED |
| Grounding DINO | https://huggingface.co/IDEA-Research/grounding-dino-base ; https://huggingface.co/docs/transformers/en/model_doc/grounding-dino (transformers v5.17.0 docs) | Apache-2.0 (HF 1.0 weights) | Open weights are Grounding DINO 1.0 (tiny/base). 1.5 / 1.6 exist as papers/API only - not read this run (UNVERIFIED) | VERIFIED for 1.0 |
| Florence-2 | https://huggingface.co/microsoft/Florence-2-large | MIT | 0.77B params; needs `trust_remote_code=True`; no newer version on the card | VERIFIED |

Snippets (read):
```python
# OWLv2
processor = Owlv2Processor.from_pretrained("google/owlv2-base-patch16-ensemble")
model = Owlv2ForObjectDetection.from_pretrained("google/owlv2-base-patch16-ensemble")
inputs = processor(text=texts, images=image, return_tensors="pt")
results = processor.post_process_object_detection(outputs=outputs, target_sizes=target_sizes, threshold=0.1)

# Grounding DINO (transformers v5.17.0 docs)
processor = AutoProcessor.from_pretrained("IDEA-Research/grounding-dino-tiny")
model = AutoModelForZeroShotObjectDetection.from_pretrained("IDEA-Research/grounding-dino-tiny", device_map="auto")
text_labels = [["a cat", "a remote control"]]
inputs = processor(images=image, text=text_labels, return_tensors="pt").to(model.device)
results = processor.post_process_grounded_object_detection(
    outputs, inputs.input_ids, threshold=0.4, text_threshold=0.3, target_sizes=[image.size[::-1]])
# signature defaults: threshold=0.25, text_threshold=0.25; returns scores, boxes [x0,y0,x1,y1], labels, text_labels
# NOTE: the model card still shows the older kwarg name box_threshold; the v5.17 processor uses `threshold`.

# Florence-2 task prompts: <OD>, <CAPTION_TO_PHRASE_GROUNDING>, <DENSE_REGION_CAPTION>, <REGION_PROPOSAL>,
# <OCR>, <OCR_WITH_REGION>, <CAPTION>/<DETAILED_CAPTION>/<MORE_DETAILED_CAPTION>
model = AutoModelForCausalLM.from_pretrained("microsoft/Florence-2-large", trust_remote_code=True)
processor = AutoProcessor.from_pretrained("microsoft/Florence-2-large", trust_remote_code=True)
```
Which to teach: Grounding DINO for accuracy ceiling on "the SKU in the host's hand", Florence-2 when you also
want OCR of on-screen price cards (one model, MIT), OWLv2 as the simplest baseline. Third-party 2026 surveys
also list RF-DETR (closed-vocab real-time) - not read, UNVERIFIED.

---

## 3. Speech-to-text with word timestamps

| Tool | URL | Version | Licence | Status |
|---|---|---|---|---|
| openai-whisper | https://pypi.org/project/openai-whisper/ ; https://github.com/openai/whisper ; whisper/transcribe.py | **20250625** (2025-06-26) | MIT (code + weights) | VERIFIED |
| faster-whisper | https://pypi.org/project/faster-whisper/ | **1.2.1** (2025-10-31) | MIT | VERIFIED |
| whisperx | https://pypi.org/project/whisperx/ ; https://github.com/m-bain/whisperX | **3.8.6** (2026-05-25); Python >=3.10,<3.14; CUDA 12.8 | BSD-2-Clause | VERIFIED |

Whisper models (README table): tiny 39M, base 74M, small 244M, medium 769M, large 1550M, turbo 809M
(`turbo` = optimised large-v3, not for translation).

**Timestamp approaches (read):**
- Whisper: `model.transcribe(audio, word_timestamps=True)` (default False; CLI `--word_timestamps True`,
  marked "(experimental)"). Docstring: word timings come from "the cross-attention pattern and dynamic time
  warping". Each segment gets `words: [{word, start, end, probability}]`. Punctuation merge defaults:
  `prepend_punctuations="\"'"¿([{-"`, `append_punctuations="\"'.。,，!！?？:：")]}、"`.
- faster-whisper (CTranslate2, "up to 4x faster ... less memory"):
  ```python
  segments, _ = model.transcribe("audio.mp3", word_timestamps=True)
  for word in segment.words: print("[%.2fs -> %.2fs] %s" % (word.start, word.end, word.word))
  ```
  `BatchedInferencePipeline(model)` with `batch_size=16` for throughput.
- WhisperX: transcribe with batching, then **forced alignment with a language-specific wav2vec2 phoneme
  model** for per-word timings (claims 70x realtime with large-v2), VAD pre-segmentation, optional
  pyannote diarisation:
  ```python
  model = whisperx.load_model("large-v2", device="cuda")
  audio = whisperx.load_audio("audio.mp3")
  result = model.transcribe(audio, batch_size=16)
  model_a, metadata = whisperx.load_align_model(language_code=result["language"], device="cuda")
  result = whisperx.align(result["segments"], model_a, metadata, audio, device)
  # then DiarizationPipeline(...) and whisperx.assign_word_speakers(...)
  ```
  For Mandarin live streams check the wav2vec2 align-model coverage before promising word-level accuracy
  (not verified this run).

### Managed APIs
| Vendor | URL | Models | Word timestamps | Price | Status |
|---|---|---|---|---|---|
| Deepgram | https://deepgram.com/pricing ; https://developers.deepgram.com/docs/models-languages-overview ; https://developers.deepgram.com/docs/pre-recorded-audio | `nova-3` (+ `nova-3-general/medical/pharma`), `flux-general-en` / `flux-general-multi` (conversational, turn detection), `nova-2-*` | `results.channels[].alternatives[].words[]` with `word, start, end` (seconds), `confidence`, `punctuated_word`; `paragraphs` object; `smart_format=True` | Nova-3 pre-recorded PAYG **$0.0043/min mono = $0.26/hr**, multilingual $0.0052/min = $0.31/hr; streaming promo $0.0048/min (regular $0.0077) ; $200 free credit | VERIFIED (per-hour figures are my arithmetic) |
| AssemblyAI | https://www.assemblyai.com/pricing ; https://www.assemblyai.com/docs/speech-to-text/pre-recorded-audio | Universal-3.5 Pro, Universal-2; `best`/`nano`/`slam-1` deprecated | `words[]` with `text, start, end` (**milliseconds**), `confidence`, `speaker` | **Universal-3.5 Pro $0.21/hr**, Universal-2 $0.15/hr; streaming u3-rt-pro $0.45/hr, Universal-Streaming $0.15/hr, billed on session time; $50 free credit | VERIFIED |
Deepgram SDK (read):
```python
from deepgram import DeepgramClient
deepgram = DeepgramClient(api_key=os.getenv("DEEPGRAM_API_KEY"))
response = deepgram.listen.v1.media.transcribe_url(url=..., model="nova-3", smart_format=True)  # or transcribe_file
```
AssemblyAI SDK (read): `from assemblyai.prerecorded.v2 import Transcriber; Transcriber(api_key=...).transcribe(...)`.
Teaching point: Deepgram returns seconds, AssemblyAI returns ms - normalise before joining to video frames.

---

## 4. Video-language models for segment labelling

### Gemini API
| Field | Value | Status |
|---|---|---|
| URLs | https://ai.google.dev/gemini-api/docs/video-understanding ; https://ai.google.dev/gemini-api/docs/models ; https://ai.google.dev/gemini-api/docs/pricing ; https://pypi.org/project/google-genai/ | VERIFIED |
| SDK | **google-genai 2.25.0**, 2026-09-22, Apache-2.0; README warns to pin `<3.0.0` | VERIFIED |
| Models named on the video page | `gemini-3.8-flash` (recommended), `gemini-3.7-flash`, `gemini-3.6-flash`, `gemini-3.5-flash-lite`. Models page also lists `gemini-3.5-flash`, `gemini-3.1-pro-preview`, `gemini-3-flash-preview`, `gemini-3.5-transcribe`, `gemini-3.8-live`; "Gemini 2.5 models are limiting access to prior users" | VERIFIED |
| Video limits (verbatim) | "Models with a 1M context window can process videos up to 3 hours long by default (at low media resolution), or up to 1 hour long at high media resolution." 2M-context limits described only as "extended" (number UNVERIFIED) | VERIFIED |
| Tokens | "Approximately 100 tokens per second of video at default (low) media resolution, or approximately 300 tokens per second of video at high media resolution"; audio 32 tokens/s; static mode samples 1 fps; an "agentic" mode loads content on demand (up to 88% fewer tokens on long video) | VERIFIED |
| Input paths | Files API 20 GB paid / 2 GB free; inline < 100 MB; public YouTube URLs (8 h/day free tier) | VERIFIED |
| Formats | MP4, MPEG, MOV, AVI, FLV, MPG, WebM, WMV, 3GPP | VERIFIED |
| Clipping / fps | `processing: {type: "static", start_offset, end_offset, fps}` | VERIFIED |

Verbatim Python from the video page:
```python
from google import genai
client = genai.Client()
video_file = client.files.upload(file="path/to/video.mp4")
interaction = client.interactions.create(
        model="gemini-3.8-flash",
        input=[
            {"type": "video", "uri": video_file.uri, "mime_type": video_file.mime_type,
             "processing": {"type": "static", "fps": 0.5}},   # Sample 1 frame every 2 seconds
            {"type": "text", "text": "Describe the scene changes in this video."},
        ],
    )
print(interaction.output_text)
```
Pricing (paid tier, per 1M tokens, read 2026-09-24): gemini-3.8-flash and 3.7-flash **$0.75 in / $3.75 out
through 2026-12-31, then $1.50 / $7.50**; gemini-3.5-flash $1.50 / $9.00; gemini-3.5-flash-lite $0.30 / $2.50;
gemini-3.1-pro-preview $2 / $12 (<=200k) and $4 / $18 (>200k); gemini-2.5-flash $0.30 / $2.50; Batch API
about 50% off. **Derived per-minute video cost** (low res, 100 tok/s video + 32 tok/s audio = 7,920 tokens/min):
3.8-flash about **$0.006 per minute of video input** at the promo rate, about $0.012 after 2026-12-31;
3.5-flash-lite about $0.0024/min. (Arithmetic mine; token rates read.)

### Qwen3-VL
| Field | Value | Status |
|---|---|---|
| URLs | https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct ; https://github.com/QwenLM/Qwen3-VL | VERIFIED |
| Family | 2B, 4B, 8B, 32B dense; 30B-A3B and 235B-A22B MoE; Instruct and Thinking editions; FP8 variants. Released Nov 2025 per repo; **no Qwen3.5-VL mentioned** | VERIFIED |
| Licence | **Apache-2.0** | VERIFIED |
| Video | default `fps=2` sampling, `max_pixels`/`min_pixels`, `total_pixels` token budget, `num_frames`; "Text-Timestamp Alignment" for event localisation; 256K context native, 1M extendable; backends torchvision / decord / torchcodec | VERIFIED |
```python
from transformers import Qwen3VLForConditionalGeneration, AutoProcessor
model = Qwen3VLForConditionalGeneration.from_pretrained("Qwen/Qwen3-VL-8B-Instruct", dtype="auto", device_map="auto")
processor = AutoProcessor.from_pretrained("Qwen/Qwen3-VL-8B-Instruct")
# video: {"type": "video", "video": "file:///clip.mp4", "fps": 2.0} inside messages, then
images, videos, video_kwargs = process_vision_info(messages, image_patch_size=16,
                                                   return_video_kwargs=True, return_video_metadata=True)
```
(The HF card snippet shown was image-only; the video message shape comes from the GitHub README - PARTIAL.)

### Twelve Labs
| Field | Value | Status |
|---|---|---|
| URLs | https://docs.twelvelabs.io/docs/concepts/models ; https://docs.twelvelabs.io/docs/concepts/models/pegasus ; https://pypi.org/pypi/twelvelabs/json ; release-notes page (via search) | VERIFIED / PARTIAL |
| SDK | `twelvelabs` **1.3.4** on PyPI; API v1.3 | VERIFIED |
| Models | **Marengo 3.0** (search + embeddings; GA on first-party API; Marengo 2.7 being deprecated with auto-reindex from mid-March 2026) and **Pegasus 1.5** (analyse / generate text; "Long-Context Video Reasoning"). Bedrock still carries Pegasus 1.2. | VERIFIED via PyPI description + release notes search result |
| Pegasus limits | video 1 s to 2 h standard (4 h when analysing a portion), file <= 10 GB | VERIFIED |
| Marengo limits | not on fetched pages | UNVERIFIED |
| Pricing | not fetched | UNVERIFIED |

---

## 5. Tabular ML, explanation, panel and causal

| Library | URL | Version | Licence | Status |
|---|---|---|---|---|
| LightGBM | https://pypi.org/project/lightgbm/ ; https://github.com/microsoft/LightGBM/blob/master/LICENSE | **4.7.0** (2026-07-18); Python >= 3.10 | MIT | VERIFIED |
| SHAP | https://pypi.org/project/shap/ ; https://shap.readthedocs.io/en/latest/generated/shap.TreeExplainer.html | **0.52.0** (2026-05-28); **Python >= 3.12** | MIT | VERIFIED |
| linearmodels | https://pypi.org/project/linearmodels/ ; PanelOLS + PanelOLS.fit docs | **7.0** (2025-10-21) | NCSA | VERIFIED |
| statsmodels | https://pypi.org/project/statsmodels/ | **0.15.0** (2026-08-27) | BSD-3-Clause | VERIFIED |
| DoWhy | https://pypi.org/project/dowhy/ ; https://www.pywhy.org/dowhy/main/getting_started/index.html | **0.14** (2025-11-08) | MIT | VERIFIED |
| EconML | https://pypi.org/project/econml/ | **0.17.0** (2026-07-31); Python 3.9-3.14 | MIT | VERIFIED |

SHAP TreeExplainer (read):
```python
shap.TreeExplainer(model, data=None, model_output='raw',
                   feature_perturbation='auto' | 'interventional' | 'tree_path_dependent',
                   feature_names=None, approximate=..., link=None, linearize_link=None)
explainer.shap_values(X, y=None, tree_limit=None, approximate=False, check_additivity=True)
    # -> (n_samples, n_features) or (n_samples, n_features, n_outputs); sum + expected_value == model output
explainer.shap_interaction_values(X)  # (n, f, f); diagonal = main effects
```
Supports XGBoost, LightGBM, CatBoost, scikit-learn, PySpark trees; plots: waterfall, force, scatter, beeswarm.

linearmodels PanelOLS (read):
```python
PanelOLS(dependent, exog, *, weights=None, entity_effects=False, time_effects=False, other_effects=None,
         singletons=True, drop_absorbed=False, check_rank=True)   # data: MultiIndex (entity, time)
res = mod.fit(cov_type='clustered', cluster_entity=True, cluster_time=False)  # or clusters=<1-2 vars>
# cov_type in {'unadjusted'|'homoskedastic', 'robust'|'heteroskedastic', 'clustered', 'kernel' (Driscoll-Kraay; kernel=bartlett|parzen|qs, bandwidth)}
# fit(use_lsdv=False, use_lsmr=False, low_memory=None, debiased=True, auto_df=True, count_effects=True)
```
Course use: stream x minute panel, `entity_effects=True` (stream) + `time_effects=True` (minute-of-show),
cluster by stream.

DoWhy four steps (read, getting-started page):
```python
model = CausalModel(data=df, treatment=..., outcome=..., graph=gml_graph)
identified_estimand = model.identify_effect()
estimate = model.estimate_effect(identified_estimand, method_name="backdoor.propensity_score_matching")
refute = model.refute_estimate(identified_estimand, estimate, method_name="random_common_cause")
```
EconML estimators (read): `LinearDML`, `CausalForestDML`, `DRLearner` (+ Linear/Sparse/Forest DR), ORF,
X/S/T meta-learners, IV methods - for "which streams/hosts benefit most from a pinned-product prompt".

---

## 6. Forecasting / nowcasting, bandits, switchbacks

### Nixtla statsforecast
| Field | Value | Status |
|---|---|---|
| URLs | https://pypi.org/pypi/statsforecast/json ; https://github.com/Nixtla/statsforecast ; https://nixtlaverse.nixtla.io/statsforecast/src/core/models.html ; .../docs/tutorials/multipleseasonalities.html ; .../docs/models/multipleseasonaltrend.html | VERIFIED (pypi.org HTML page blocked by client challenge; JSON API used) |
| Version | **2.1.1** (PyPI JSON; latest wheel upload 2024-09-13); Python >= 3.10. GitHub releases page also shows v2.1.1 as latest. No release since - flag to learners that the package is stable but slow-moving. | VERIFIED |
| Licence | Apache-2.0 | VERIFIED |

Data shape `unique_id, ds, y`. Signatures (read):
```python
AutoETS(season_length=1, model='ZZZ', damped=None, phi=None, alias='AutoETS', prediction_intervals=None, distribution='normal')
AutoTheta(season_length=1, decomposition_type='multiplicative', model=None, alias='AutoTheta', prediction_intervals=None, distribution='normal')
MSTL(season_length=[24, 24*7], trend_forecaster=AutoARIMA(), stl_kwargs=..., alias=..., prediction_intervals=...)  # defaults for stl_kwargs not read (PARTIAL)
AutoARIMA(..., season_length=1, ic='aicc', stepwise=True, test='kpss', ...)
sf = StatsForecast(models=[MSTL(season_length=[24, 24*7], trend_forecaster=AutoARIMA())], freq='h')
forecasts = sf.forecast(df=df, h=24, level=[90])
```
For 1-minute live-stream series: `freq='min'`, `season_length=[60]` (hourly cadence) or `[60, 60*k]` where k
is the show's segment length; MSTL handles the multiple seasonalities, AutoETS/AutoTheta for short horizons
with prediction intervals. Model list also includes AutoCES, AutoMFLES, AutoTBATS, MFLES, TBATS, GARCH,
SeasonalNaive baselines.

### State-space / Kalman option
statsmodels `UnobservedComponents` (https://www.statsmodels.org/stable/generated/statsmodels.tsa.statespace.structural.UnobservedComponents.html, VERIFIED):
```python
UnobservedComponents(endog, level=False, trend=False, seasonal=None, freq_seasonal=None, cycle=False,
                     autoregressive=None, exog=None, irregular=False, stochastic_level=False,
                     stochastic_trend=False, stochastic_seasonal=True, stochastic_freq_seasonal=None,
                     stochastic_cycle=False, damped_cycle=False, cycle_period_bounds=None,
                     mle_regression=True, use_exact_diffuse=False)
# level='local level' (y_t = mu_t + e_t; mu_t = mu_{t-1} + eta_t) | 'local linear trend' | 'smooth trend'
res = mod.fit(); res.level, res.trend, res.seasonal, res.cycle (smoothed components); res.forecast(h)
```
A local-level model is the textbook Kalman nowcaster for "true viewer count" under noisy per-minute reads.

### Bandits
| Library | URL | Version | Licence | Status |
|---|---|---|---|---|
| MABWiser | https://pypi.org/pypi/mabwiser/json ; https://github.com/fidelity/mabwiser | **2.7.4** (2024-08-30) | Apache-2.0 | VERIFIED |
| Vowpal Wabbit | https://pypi.org/pypi/vowpalwabbit/json ; https://vowpalwabbit.org/docs/vowpal_wabbit/python/latest/tutorials/python_Contextual_bandits_and_Vowpal_Wabbit.html | **9.11.6** (2024-12-13); Python >= 3.10 | BSD-3-Clause | VERIFIED |
```python
from mabwiser.mab import MAB, LearningPolicy
mab = MAB(arms=['Arm1','Arm2'], learning_policy=LearningPolicy.UCB1(alpha=1.25))
mab.fit(decisions, rewards); mab.predict(); mab.partial_fit(...)
# policies: EpsilonGreedy, LinGreedy, LinTS, LinUCB, Popularity, Random, Softmax, ThompsonSampling, UCB1
# neighborhood: Clusters, KNearest, LSHNearest, Radius, TreeBandit

import vowpalwabbit
vw = vowpalwabbit.Workspace("--cb 4", quiet=True)      # or "--cb_explore_adf --epsilon 0.2"
vw.learn("1:2:0.4 | a c")                              # action:cost:probability | features
vw.predict("| a b")
# exploration flags documented: --first, --epsilon, --bag, --cover, --softmax (adf only)
```
Both libraries are unchanged since 2024 - fine for teaching, but say so.

### Switchback design citation
Bojinov, I., Simchi-Levi, D., Zhao, J. (2023). "Design and Analysis of Switchback Experiments."
*Management Science* 69(7): 3759-3777. https://doi.org/10.1287/mnsc.2022.4583 (INFORMS page returned 403;
arXiv:2009.00148 abstract VERIFIED, journal volume/issue from search results - PARTIAL). Content: minimax
optimal switchback design under carryover, exact randomisation p-values and a finite-population CLT for
CIs, guidance when the carryover order is misspecified. Newer 2026 arXiv follow-ups surfaced in search
(random-duration switchbacks 2609.13698; CUPED for switchbacks 2608.24038) - not read, UNVERIFIED.

---

## 7. Multi-object-tracking metrics (quick)

- **MOTA** - Bernardin, K., Stiefelhagen, R. (2008). "Evaluating Multiple Object Tracking Performance: The
  CLEAR MOT Metrics." *EURASIP Journal on Image and Video Processing* 2008(1):1-10. Springer page returned
  403 twice; formula read from the MOT16 paper PDF (Milan, Leal-Taixe, Reid, Roth, Schindler 2016,
  arXiv:1603.00831, eq. 1), which cites Bernardin 2008:
  `MOTA = 1 - sum_t (FN_t + FP_t + IDSW_t) / sum_t GT_t`. VERIFIED via MOT16.
- **IDF1** - Ristani, Solera, Zou, Cucchiara, Tomasi (2016). "Performance Measures and a Data Set for
  Multi-Target, Multi-Camera Tracking." ECCV 2016 Workshops. arXiv:1609.01775 PDF read:
  `IDP = IDTP/(IDTP+IDFP)`, `IDR = IDTP/(IDTP+IDFN)`, `IDF1 = 2*IDTP/(2*IDTP+IDFP+IDFN)` over a global
  bipartite matching of ground-truth to computed identities. VERIFIED.
- **HOTA** - Luiten, Osep, Dendorfer, Torr, Geiger, Leal-Taixe, Leibe (2020). "HOTA: A Higher Order Metric
  for Evaluating Multi-Object Tracking." *IJCV*. arXiv:2009.07736. Definition from the TrackEval README
  (MIT, https://github.com/JonathonLuiten/TrackEval): "a geometric mean of DetA and AssA averaged over
  localisation thresholds"; sub-metrics DetA, AssA, LocA, DetPr, DetRe, AssPr, AssRe. TrackEval also
  implements CLEAR (MOTA, MOTP, MT, ML, Frag) and Identity (IDF1, IDP, IDR). VERIFIED.

---

## Fetch log (failures and workarounds)
- pypi.org HTML pages for statsforecast, mabwiser, vowpalwabbit -> "client challenge"; used
  https://pypi.org/pypi/<pkg>/json instead.
- ai.google.dev MediaPipe URLs -> 301 to developers.google.com; refetched there.
- docs.twelvelabs.io/docs/models -> 404; concepts/models and concepts/models/pegasus fetched.
- link.springer.com (Bernardin 2008) -> 403 twice; formula taken from MOT16 PDF.
- pubsonline.informs.org -> 403; arXiv abstract + search for volume/issue.
- nixtlaverse .../models/mstl.html -> 404; tutorial + multipleseasonaltrend pages used.
- Whisper README has no word_timestamps text; read whisper/transcribe.py source instead.
