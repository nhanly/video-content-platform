import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';

import { StreamingService } from '@/video/application/services/streaming.service';

@Controller('streaming')
@ApiTags('Streaming')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @Get('video/:id/manifest.m3u8')
  @ApiOperation({ summary: 'Get HLS manifest for video streaming' })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({
    status: 200,
    description: 'HLS manifest returned successfully',
    content: {
      'application/vnd.apple.mpegurl': {
        schema: { type: 'string' },
      },
    },
  })
  @Header('Content-Type', 'application/vnd.apple.mpegurl')
  @Header('Cache-Control', 'max-age=3600')
  async getHLSManifest(
    @Param('id') videoId: string,
    @Req() req: Request & { user?: { userId: string } },
  ): Promise<string> {
    const userId = req.user?.userId;
    return await this.streamingService.generateHLSManifest(videoId, userId);
  }

  @Get('video/:id/manifest.mpd')
  @ApiOperation({ summary: 'Get DASH manifest for video streaming' })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({
    status: 200,
    description: 'DASH manifest returned successfully',
    content: {
      'application/dash+xml': {
        schema: { type: 'string' },
      },
    },
  })
  @Header('Content-Type', 'application/dash+xml')
  @Header('Cache-Control', 'max-age=3600')
  async getDASHManifest(
    @Param('id') videoId: string,
    @Req() req: Request & { user?: { userId: string } },
  ): Promise<string> {
    const userId = req.user?.userId;
    return await this.streamingService.generateDASHManifest(videoId, userId);
  }

  @Get('video/:id/segment/:segment')
  @ApiOperation({ summary: 'Get video segment for streaming' })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiParam({ name: 'segment', description: 'Segment filename' })
  @ApiResponse({ status: 302, description: 'Redirect to segment URL' })
  async getVideoSegment(
    @Param('id') videoId: string,
    @Param('segment') segment: string,
    @Req() req: Request & { user?: { userId: string } },
    @Res() res: Response,
  ): Promise<void> {
    const userId = req.user?.userId;
    const segmentUrl = await this.streamingService.getSegmentUrl(
      videoId,
      segment,
      userId,
    );
    res.redirect(302, segmentUrl);
  }

  @Post('video/:id/view')
  @ApiOperation({ summary: 'Record video view for analytics' })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({ status: 201, description: 'View recorded successfully' })
  @ApiBearerAuth()
  async recordView(
    @Param('id') videoId: string,
    @Body() body: { watchDuration?: number },
    @Req() req: Request & { user?: { userId: string } },
  ): Promise<{ success: boolean }> {
    const userId = req.user?.userId;
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.get('User-Agent');

    await this.streamingService.recordView(
      videoId,
      userId,
      ipAddress,
      userAgent,
      body.watchDuration,
    );

    return { success: true };
  }
}
