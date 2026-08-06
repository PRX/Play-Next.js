import {
  IAudioData,
  IListenMediaData,
  SpeakerSegmentsBlock
} from '@interfaces/data';

const fetchAudioTranscriptData = async (
  episode: IAudioData | IListenMediaData
) => {
  if (!episode?.transcripts) return null;

  const { transcripts, duration } = episode;
  const transcript = transcripts?.find(
    (t) => !!['json', 'vtt', 'srt', 'subrip'].find((n) => t.type.includes(n))
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
