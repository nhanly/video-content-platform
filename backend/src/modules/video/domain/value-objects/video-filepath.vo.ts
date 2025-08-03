interface VideoFilePathsProps {
  originalPath: string;
  processedPath?: string;
  thumbnailUrl?: string;
  hlsPlaylistUrl?: string;
  dashManifestUrl?: string;
}

export class VideoFilePaths {
  public readonly originalPath: string;
  public readonly processedPath?: string;
  public readonly thumbnailUrl?: string;
  public readonly hlsPlaylistUrl?: string;
  public readonly dashManifestUrl?: string;

  constructor(props: VideoFilePathsProps) {
    this.originalPath = props.originalPath;
    this.processedPath = props.processedPath;
    this.thumbnailUrl = props.thumbnailUrl;
    this.hlsPlaylistUrl = props.hlsPlaylistUrl;
    this.dashManifestUrl = props.dashManifestUrl;
  }
}
