import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, onNext, onPrevious }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported() && src.includes('.m3u8')) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {
          // Autoplay was prevented
          setIsPlaying(false);
        });
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {
          setIsPlaying(false);
        });
      });
    }
  }, [src]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        className="w-full aspect-video bg-black"
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress bar */}
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
          style={{
            backgroundImage: `linear-gradient(to right, #ef4444 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%)`,
          }}
        />

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-white hover:text-primary-500 transition-colors">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            {/* Previous/Next */}
            {onPrevious && (
              <button onClick={onPrevious} className="text-white hover:text-primary-500 transition-colors">
                <SkipBack className="w-6 h-6" />
              </button>
            )}
            {onNext && (
              <button onClick={onNext} className="text-white hover:text-primary-500 transition-colors">
                <SkipForward className="w-6 h-6" />
              </button>
            )}

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-white hover:text-primary-500 transition-colors">
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {/* Time */}
            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className="text-white hover:text-primary-500 transition-colors">
            <Maximize className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};