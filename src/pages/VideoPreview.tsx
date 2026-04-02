import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface VideoData {
  // New standardized fields
  no_watermark?: string;
  watermark?: string;
  music?: string;
  title: string;
  thumbnail?: string;
  author: string;
  authorAvatar: string;
  source?: string;
  // Legacy fields for backward compatibility
  downloadUrl: string;
  coverUrl?: string;
  filename?: string;
}

const VideoPreview = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloadingVideo, setIsDownloadingVideo] = useState(false);
  const [isDownloadingMusic, setIsDownloadingMusic] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [imageError, setImageError] = useState(false);
  const url = searchParams.get("url");

  useEffect(() => {
    if (!url) {
      navigate("/");
      return;
    }

    const fetchVideoData = async () => {
      try {
        const response = await fetch('/api/download-tiktok', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch video');
        }

        if (data) {
          setVideoData(data);
        } else {
          throw new Error("No data received");
        }
      } catch (error) {
        console.error("Error fetching video:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load video. Please check the URL and try again.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoData();
  }, [url, navigate, toast]);

  const handleDownload = async (type: 'video' | 'music') => {
    const downloadUrl = type === 'video'
      ? (videoData?.no_watermark || videoData?.downloadUrl)
      : videoData?.music;

    if (!downloadUrl) {
      toast({
        title: "Error",
        description: `${type === 'video' ? 'Video' : 'Music'} not available`,
        variant: "destructive",
      });
      return;
    }

    // Set loading state based on type
    if (type === 'video') {
      setIsDownloadingVideo(true);
    } else {
      setIsDownloadingMusic(true);
    }

    try {
      const streamUrl = `/api/stream-video?url=${encodeURIComponent(downloadUrl)}`;

      // Fetch the file as a blob
      const response = await fetch(streamUrl);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();

      // Generate random 10-digit number
      const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dawntik_${randomNumber}.${type === 'video' ? 'mp4' : 'mp3'}`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success!",
        description: `${type === 'video' ? 'Video' : 'Music'} downloaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to download ${type}`,
        variant: "destructive",
      });
    } finally {
      if (type === 'video') {
        setIsDownloadingVideo(false);
      } else {
        setIsDownloadingMusic(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading video...</p>
        </div>
      </div>
    );
  }

  if (!videoData) {
    return null;
  }

  return (
    <div className="bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-20 animate-pulse" />

      <div className="relative z-10 container mx-auto px-4 py-8 pt-16">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Video Info */}
          <Card className="p-6 backdrop-blur-sm bg-card/80 border-2 border-primary/20">
            <div className="flex items-start gap-4 mb-6">
              {videoData.authorAvatar && !imageError ? (
                <img
                  src={videoData.authorAvatar}
                  alt={videoData.author}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {videoData.author.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  {videoData.title}
                </h2>
                <p className="text-muted-foreground">@{videoData.author}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => handleDownload('video')}
                disabled={isDownloadingVideo || isDownloadingMusic}
                className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-glow hover:shadow-[0_0_50px_hsl(var(--primary)/0.5)]"
              >
                {isDownloadingVideo ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Without Watermark HD
                  </>
                )}
              </Button>

              {videoData.music && (
                <Button
                  onClick={() => handleDownload('music')}
                  disabled={isDownloadingVideo || isDownloadingMusic}
                  variant="outline"
                  className="w-full h-12 text-lg font-semibold hover:bg-primary/10 hover:scale-105 hover:border-primary transition-all duration-300"
                >
                  {isDownloadingMusic ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download Music
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
