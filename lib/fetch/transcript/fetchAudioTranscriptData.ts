import { IAudioData, SpeakerSegmentsBlock } from '@interfaces/data';

const fetchAudioTranscriptData = async (episode: IAudioData) => {
  if (!episode?.transcripts) return null;

  const { transcripts, duration } = episode;
  const transcript = transcripts?.find(
    (t) => !!['json', 'vtt', 'srt'].find((n) => t.type.includes(n))
  );
  const { url } = transcript || {};
  const fetchUrl = `/api/proxy/transcript?u=${url}&cb=${duration}`;

  const transcriptResponse =
    fetchUrl &&
    (await fetch(fetchUrl).then<SpeakerSegmentsBlock[]>(
      (res) => res.ok && res.json()
    ));

  return transcriptResponse;
};

export default fetchAudioTranscriptData;
