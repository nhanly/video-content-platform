export class VideoMetadata {
  public readonly duration: number;
  public readonly fileSize: number | bigint;
  public readonly resolution: string;
  public readonly format: string;
  public readonly bitrate: number;

  constructor(props: {
    duration: number;
    fileSize: number | bigint;
    resolution: string;
    format: string;
    bitrate: number;
  }) {
    this.duration = props.duration;
    this.fileSize = props.fileSize;
    this.resolution = props.resolution;
    this.format = props.format;
    this.bitrate = props.bitrate;
  }
}
