import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/core/guards/jwt-auth.guard';
import { RateLimit } from '@/shared/core/decorators/rate-limit.decorator';
import { RateLimitGuard } from '@/shared/core/guards/rate-limit.guard';
import { UploadVideoCommand } from '@/video/application/commands/upload-video.command';
import { ListVideosDto } from '@/video/application/dto/list-videos.dto';
import {
  PaginatedVideoResponse,
  VideoResponseDto,
} from '@/video/application/dto/video-response.dto';
import { GetVideoQuery } from '@/video/application/queries/get-video.query';
import { ListVideosQuery } from '@/video/application/queries/list-videos.query';
import { GetVideoUseCase } from '@/video/application/use-cases/get-video.use-case';
import { ListVideosUseCase } from '@/video/application/use-cases/list-videos.use-case';
import { UploadVideoUseCase } from '@/video/application/use-cases/upload-video.use-case';
import { UploadVideoDto } from '@/video/presentation/dto/upload-video.dto';

@Controller('videos')
@ApiTags('Videos')
export class VideoController {
  constructor(
    private readonly uploadVideoUseCase: UploadVideoUseCase,
    private readonly getVideoUseCase: GetVideoUseCase,
    private readonly listVideosUseCase: ListVideosUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RateLimitGuard)
  @RateLimit({ limit: 5, windowMs: 300000 })
  @UseInterceptors(FileInterceptor('video'))
  @ApiOperation({ summary: 'Upload a new video' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Video uploaded successfully' })
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadVideoDto: UploadVideoDto,
    @Request() req: { user: { userId: string } },
  ): Promise<{ success: boolean; data: unknown }> {
    const command = new UploadVideoCommand(
      uploadVideoDto.title,
      uploadVideoDto.description,
      uploadVideoDto.categoryId,
      uploadVideoDto.visibility,
      file,
      req.user.userId,
    );

    const result: unknown = await this.uploadVideoUseCase.execute(command);

    return { success: true, data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get video details by ID' })
  @ApiParam({ name: 'id', description: 'Video ID' })
  @ApiResponse({
    status: 200,
    description: 'Video details retrieved successfully',
    type: VideoResponseDto,
  })
  @ApiBearerAuth()
  @CacheKey('video_details')
  @UseInterceptors(CacheInterceptor)
  async getVideoById(
    @Param('id') videoId: string,
    @Request() req: Request & { user?: { userId: string } },
  ): Promise<{ success: boolean; data: VideoResponseDto }> {
    const userId = req.user?.userId;
    const query = new GetVideoQuery(videoId, userId);
    const result = await this.getVideoUseCase.execute(query);

    return { success: true, data: result };
  }

  @Get()
  @ApiOperation({ summary: 'List videos with pagination and filters' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['UPLOADING', 'PROCESSING', 'READY', 'FAILED'],
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'visibility',
    required: false,
    enum: ['PUBLIC', 'PRIVATE'],
    description: 'Filter by visibility',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'updatedAt', 'title', 'viewCount'],
    description: 'Sort by field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search query',
  })
  @ApiResponse({
    status: 200,
    description: 'Videos retrieved successfully',
    type: PaginatedVideoResponse,
  })
  @ApiBearerAuth()
  async listVideos(
    @Query() listVideosDto: ListVideosDto,
    @Request() req: Request & { user?: { userId: string } },
  ): Promise<{ success: boolean; data: PaginatedVideoResponse }> {
    // If user is authenticated, allow them to see their own videos regardless of status
    const userId = req.user?.userId;
    const queryUserId =
      listVideosDto.userId ||
      (userId && listVideosDto.status ? userId : undefined);

    const query = new ListVideosQuery(
      listVideosDto.page,
      listVideosDto.limit,
      listVideosDto.categoryId,
      queryUserId,
      listVideosDto.status,
      listVideosDto.visibility,
      listVideosDto.sortBy,
      listVideosDto.sortOrder,
      listVideosDto.search,
    );

    const result = await this.listVideosUseCase.execute(query);

    return { success: true, data: result };
  }
}
