// src/database/prisma/seed.ts
import {
  PrismaClient,
  UserRole,
  VideoStatus,
  VideoVisibility,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        username: 'admin',
        passwordHash:
          '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // 'password'
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        emailVerified: true,
        avatarUrl: 'https://i.pravatar.cc/300?img=1',
      },
    }),
    prisma.user.upsert({
      where: { email: 'john.doe@example.com' },
      update: {},
      create: {
        email: 'john.doe@example.com',
        username: 'johndoe',
        passwordHash:
          '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // 'password'
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.USER,
        emailVerified: true,
        avatarUrl: 'https://i.pravatar.cc/300?img=2',
      },
    }),
    prisma.user.upsert({
      where: { email: 'jane.smith@example.com' },
      update: {},
      create: {
        email: 'jane.smith@example.com',
        username: 'janesmith',
        passwordHash:
          '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // 'password'
        firstName: 'Jane',
        lastName: 'Smith',
        role: UserRole.MODERATOR,
        emailVerified: true,
        avatarUrl: 'https://i.pravatar.cc/300?img=3',
      },
    }),
    prisma.user.upsert({
      where: { email: 'mike.wilson@example.com' },
      update: {},
      create: {
        email: 'mike.wilson@example.com',
        username: 'mikewilson',
        passwordHash:
          '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // 'password'
        firstName: 'Mike',
        lastName: 'Wilson',
        role: UserRole.USER,
        emailVerified: true,
        avatarUrl: 'https://i.pravatar.cc/300?img=4',
      },
    }),
  ]);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { code: 'music' },
      update: {},
      create: {
        name: 'Music',
        code: 'music',
        description: 'Music videos and performances',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { code: 'gaming' },
      update: {},
      create: {
        name: 'Gaming',
        code: 'gaming',
        description: 'Gaming videos and streams',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { code: 'documentary' },
      update: {},
      create: {
        name: 'Documentary',
        code: 'documentary',
        description: 'Documentary and educational videos',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { code: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        code: 'technology',
        description: 'Tech reviews and tutorials',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { code: 'entertainment' },
      update: {},
      create: {
        name: 'Entertainment',
        code: 'entertainment',
        description: 'Comedy, movies, and entertainment',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1489599904056-fd6b030dab21?w=300&h=200&fit=crop',
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { code: 'education' },
      update: {},
      create: {
        name: 'Education',
        code: 'education',
        description: 'Educational and tutorial content',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
        sortOrder: 6,
      },
    }),
  ]);

  // Create videos with real YouTube URLs (using embed format for streaming)
  const videos = await Promise.all([
    prisma.video.upsert({
      where: { code: 'big-buck-bunny' },
      update: {},
      create: {
        title: 'Big Buck Bunny',
        description:
          'Big Buck Bunny is a short computer-animated comedy film by the Blender Institute.',
        code: 'big-buck-bunny',
        userId: users[1].id, // John Doe
        categoryId: categories[4].id, // Entertainment
        duration: 596, // 9:56
        status: VideoStatus.READY,
        visibility: VideoVisibility.PUBLIC,
        originalFilePath:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        processedFilePath:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        hlsPlaylistUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
        viewCount: BigInt(12450),
        likeCount: 892,
        dislikeCount: 23,
        commentCount: 156,
        tags: ['animation', 'blender', 'short-film', 'comedy'],
        metaTitle: 'Big Buck Bunny - Animated Short Film',
        metaDescription:
          'Watch the amazing Big Buck Bunny animated short film created with Blender.',
      },
    }),
    prisma.video.upsert({
      where: { code: 'elephant-dream' },
      update: {},
      create: {
        title: 'Elephant Dream',
        description:
          'Elephants Dream is a computer-animated short film produced by Blender Foundation.',
        code: 'elephant-dream',
        userId: users[1].id, // John Doe
        categoryId: categories[4].id, // Entertainment
        duration: 654, // 10:54
        status: VideoStatus.READY,
        visibility: VideoVisibility.PUBLIC,
        originalFilePath:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        processedFilePath:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        hlsPlaylistUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
        viewCount: BigInt(8930),
        likeCount: 654,
        dislikeCount: 12,
        commentCount: 89,
        tags: ['animation', 'blender', 'sci-fi', 'dream'],
        metaTitle: 'Elephant Dream - Blender Animation',
        metaDescription:
          'A surreal animated journey through dreams and imagination.',
      },
    }),
    prisma.video.upsert({
      where: { code: 'for-bigger-blazes' },
      update: {},
      create: {
        title: 'For Bigger Blazes',
        description: 'A sample video about dealing with bigger challenges.',
        code: 'for-bigger-blazes',
        userId: users[2].id, // Jane Smith
        categoryId: categories[5].id, // Education
        duration: 15,
        status: VideoStatus.READY,
        visibility: VideoVisibility.PUBLIC,
        originalFilePath:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        processedFilePath:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        hlsPlaylistUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
        viewCount: BigInt(3421),
        likeCount: 287,
        dislikeCount: 8,
        commentCount: 45,
        tags: ['motivation', 'education', 'short'],
        metaTitle: 'For Bigger Blazes - Motivational Short',
        metaDescription: 'Learn how to tackle bigger challenges in life.',
      },
    }),
    prisma.video.upsert({
      where: { code: 'sintel-trailer' },
      update: {},
      create: {
        title: 'Sintel Trailer',
        description:
          'Trailer for Sintel, an open source 3D animated short film.',
        code: 'sintel-trailer',
        userId: users[3].id, // Mike Wilson
        categoryId: categories[4].id, // Entertainment
        duration: 52,
        status: VideoStatus.READY,
        visibility: VideoVisibility.PUBLIC,
        originalFilePath:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        processedFilePath:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        hlsPlaylistUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        thumbnailUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
        viewCount: BigInt(15678),
        likeCount: 1234,
        dislikeCount: 34,
        commentCount: 298,
        tags: ['animation', 'trailer', 'fantasy', 'blender'],
        metaTitle: 'Sintel Trailer - Fantasy Animation',
        metaDescription:
          'Epic fantasy animation trailer from the Blender Foundation.',
      },
    }),
    prisma.video.upsert({
      where: { code: 'tears-of-steel' },
      update: {},
      create: {
        title: 'Tears of Steel',
        description:
          'Tears of Steel is a live-action short film and open movie project by the Blender Foundation.',
        code: 'tears-of-steel',
        userId: users[1].id, // John Doe
        categoryId: categories[2].id, // Documentary
        duration: 734, // 12:14
        status: VideoStatus.READY,
        visibility: VideoVisibility.PUBLIC,
        originalFilePath:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        processedFilePath:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        hlsPlaylistUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnailUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
        viewCount: BigInt(22890),
        likeCount: 1876,
        dislikeCount: 45,
        commentCount: 456,
        tags: ['sci-fi', 'live-action', 'blender', 'short-film'],
        metaTitle: 'Tears of Steel - Sci-Fi Short Film',
        metaDescription:
          'A sci-fi live-action short film showcasing visual effects.',
      },
    }),
    prisma.video.upsert({
      where: { code: 'we-are-going-on-bullrun' },
      update: {},
      create: {
        title: 'We Are Going On Bullrun',
        description: 'An exciting adventure video about a bullrun experience.',
        code: 'we-are-going-on-bullrun',
        userId: users[2].id, // Jane Smith
        categoryId: categories[4].id, // Entertainment
        duration: 30,
        status: VideoStatus.READY,
        visibility: VideoVisibility.PUBLIC,
        originalFilePath:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        processedFilePath:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        hlsPlaylistUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        thumbnailUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg',
        viewCount: BigInt(5432),
        likeCount: 421,
        dislikeCount: 19,
        commentCount: 87,
        tags: ['adventure', 'cars', 'entertainment'],
        metaTitle: 'We Are Going On Bullrun - Adventure',
        metaDescription: 'Join us on an exciting bullrun adventure!',
      },
    }),
  ]);

  // Create some sample comments
  await Promise.all([
    prisma.comment.create({
      data: {
        videoId: videos[0].id,
        userId: users[2].id,
        content: 'Amazing animation! Love the attention to detail.',
      },
    }),
    prisma.comment.create({
      data: {
        videoId: videos[0].id,
        userId: users[3].id,
        content: 'This is why I love open source projects. Incredible work!',
      },
    }),
    prisma.comment.create({
      data: {
        videoId: videos[4].id,
        userId: users[1].id,
        content:
          'The visual effects in this are mind-blowing for an open source project.',
      },
    }),
  ]);

  // Create some video reactions (using upsert to handle unique constraint)
  await Promise.all([
    prisma.videoReaction.upsert({
      where: {
        videoId_userId: {
          videoId: videos[0].id,
          userId: users[2].id,
        },
      },
      update: {},
      create: {
        videoId: videos[0].id,
        userId: users[2].id,
        reactionType: 'LIKE',
      },
    }),
    prisma.videoReaction.upsert({
      where: {
        videoId_userId: {
          videoId: videos[0].id,
          userId: users[3].id,
        },
      },
      update: {},
      create: {
        videoId: videos[0].id,
        userId: users[3].id,
        reactionType: 'LIKE',
      },
    }),
    prisma.videoReaction.upsert({
      where: {
        videoId_userId: {
          videoId: videos[1].id,
          userId: users[2].id,
        },
      },
      update: {},
      create: {
        videoId: videos[1].id,
        userId: users[2].id,
        reactionType: 'LIKE',
      },
    }),
  ]);

  console.log({
    users: users.length,
    categories: categories.length,
    videos: videos.length,
    message: 'Database seeded successfully!',
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
