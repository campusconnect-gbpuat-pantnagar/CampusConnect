import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Navigation } from "swiper/modules";
import { AdvancedImage, AdvancedVideo } from "@cloudinary/react";
import styles from "./custom-carousel.module.css";
import ReactPlayer from "react-player/lazy";

export default function CustomCarousel({ slides }) {
  console.log(slides);
  return (
    <Swiper
      pagination={true}
      navigation={true}
      modules={[Pagination, Navigation]}
      className={styles.mySwiper}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index} className={styles.swiperSlide}>
          {slide.resource_type === "image" ? (
            <img
              src={slide.url}
              className={styles.slideImage}
              alt="sdkhfksdf"
            />
          ) : slide.resource_type === "video" ? (
            <ReactPlayer
              style={{ objectFit: "contain" }}
              url={slide.url}
              loop
              playIcon={true}
              controls={true}
              volume
            />
          ) : null}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
