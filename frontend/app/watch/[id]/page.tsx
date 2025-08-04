import { notFound } from "next/navigation";
import WatchPageClient from "./WatchPageClient";
import { fetchVideoById, fetchVideos } from "@/shared/api/api";

interface WatchPageProps {
  params: {
    id: string;
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const videoId = params.id;

  if (!videoId) {
    notFound();
  }

  const [video, relatedVideos] = await Promise.all([
    fetchVideoById(videoId),
    fetchVideos({ limit: 10 }).then((videos) =>
      videos.filter((v) => v.id !== videoId).slice(0, 10)
    ),
  ]);

  if (!video) {
    notFound();
  }

  return <WatchPageClient video={video} relatedVideos={relatedVideos} />;
}
