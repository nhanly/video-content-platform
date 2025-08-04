import { User } from '@/modules/user/domain/entities/user.entity';

export class VideoView {
  constructor(
    public readonly id: string,
    public readonly videoId: string,
    public readonly userId: string | null,
    public readonly ipAddress: string | null,
    public readonly userAgent: string | null,
    public readonly watchDuration: number | null,
    public readonly completionPercentage: number | null,
    public readonly createdAt: Date,
    private readonly _user?: User,
  ) {}

  public get user(): User | undefined {
    return this._user;
  }

  public isCompleteView(): boolean {
    return (
      this.completionPercentage !== null && this.completionPercentage >= 80
    );
  }

  public getWatchTimeMinutes(): number {
    return this.watchDuration ? Math.floor(this.watchDuration / 60) : 0;
  }
}
