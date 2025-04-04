import Image from 'next/image';
import { FiPlay } from 'react-icons/fi';

interface VideoCardProps {
  video: {
    id: string;
    key: string;
    name: string;
    type: string;
    site: string;
  };
  onClick: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="relative aspect-video">
        {video.site === 'YouTube' && (
          <Image
            src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
            alt={video.name}
            fill
            className="object-cover"
            unoptimized
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/10 transition-colors">
          <FiPlay className="h-12 w-12 text-white/80 hover:text-white" />
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium truncate">{video.name}</h3>
        <p className="text-sm text-gray-400 truncate">{video.type}</p>
      </div>
    </div>
  );
}