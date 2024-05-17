import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Navigation, Keyboard } from "swiper/modules";
import {
  AdvancedImage,
  AdvancedVideo,
  lazyload,
  responsive,
  placeholder,
} from "@cloudinary/react";
import styles from "./custom-carousel.module.css";
import { Cloudinary } from "@cloudinary/url-gen";
import ReactPlayer from "react-player/lazy";
export default function CustomCarousel({ slides }) {
  return (
    <Swiper
      pagination={true}
      navigation={true}
      // keyboard={true}
      modules={[Pagination, Navigation]}
      className={styles.mySwiper}
    >
      {slides.map((slide) => {
        return (
          <SwiperSlide className={styles.swiperSlide}>
            <ReactPlayer
              style={{ objectFit: "contain" }}
              url="http://res.cloudinary.com/hzxyensd5/video/upload/v1715436492/c5iamyamyoavhh8addjp.mp4"
              loop
              playIcon={true}
              controls={true}
              volume
            />
            {/* <img src={slide} className={styles.slideImage} alt="sdkhfksdf" /> */}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
