'use client';
import Slider from 'react-slick';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function PhotoCarousel({ images }: { images: string[] }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index} className="relative aspect-video">
            <Image
              src={img}
              alt={`Movie still ${index + 1}`}
              fill
              className="object-contain"
              quality={90}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
    >
      <FiChevronRight size={24} />
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
    >
      <FiChevronLeft size={24} />
    </button>
  );
}