import { BaseValueObject } from '@/modules/common/base.vo';

interface VideoStatisticsProps {
  views: number | bigint;
  likes: number;
  dislikes: number;
  comments?: number;
}

export class VideoStatistics extends BaseValueObject<VideoStatisticsProps> {
  get views() {
    return this.props.views;
  }

  get likes() {
    return this.props.likes;
  }

  get dislikes() {
    return this.props.dislikes;
  }

  get comments() {
    return this.props.comments;
  }
}
