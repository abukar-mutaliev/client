import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useRef, useState } from "react";
import Slider from "react-slick";
import ReactPlayer from "react-player";
import slide0 from "../../../shared/assets/slides/slide.png";
import slide1 from "../../../shared/assets/slides/slide1.mp4";
import "./customSlide.scss";

const slidesData = [
  {
    id: 1,
    type: "image",
    url: slide0,
  },
  {
    id: 2,
    type: "video",
    url: slide1,
  },
];

export function CustomSlider(props) {
  const [playing, setPlaying] = useState(false);
  const [currentSlideId, setCurrentSlideId] = useState(false);
  const sliderRef = useRef();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => {
      const currentSlide = slidesData[current];
      if (currentSlide.type === "video") {
        setPlaying(false);
      }
    },
    afterChange: (current) => {
      const currentSlide = slidesData[current];
      setCurrentSlideId(currentSlide.id);
      if (currentSlide.type === "video") {
        setPlaying(true);
      }
    },
  };

  return (
    <div className="slider-wrapper">
      <Slider
        ref={sliderRef}
        dots={settings.dots}
        infinite={settings.infinite}
        speed={settings.speed}
        slidesToShow={settings.slidesToShow}
        slidesToScroll={settings.slidesToScroll}
        beforeChange={settings.beforeChange}
        afterChange={settings.afterChange}
      >
        {slidesData.map((slide) => (
          <div className="slider-container" key={slide.id}>
            {slide.type === "image" && (
              <img src={slide.url} alt={`Slide ${slide.id}`} />
            )}
            {slide.type === "video" && (
              <ReactPlayer
                className="react-player"
                url={slide.url}
                playing={slide.id === currentSlideId && playing}
                onStart={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                controls
                width="100%"
                height="100%"
              />
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
}
