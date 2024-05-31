import Header from "../../common/Header/Header";
import HeaderMobile from "../../common/Header/HeaderMobile";
import styles from "./Library.module.css";
const LibraryPage = () => {
  return (
    <div>
      <HeaderMobile />
      <Header />
      <div className={styles.iframeContainer}>
        {/* ❌ : https://gbpuatopac.informaticsglobal.com/ this url cannot be render in another website  it have frame because it set 'X-Frame-Options' to 'sameorigin'. */}
        <iframe
          className={styles.iframe}
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          src="https://comming-soon-puce.vercel.app/"
        ></iframe>
      </div>
    </div>
  );
};

export default LibraryPage;
