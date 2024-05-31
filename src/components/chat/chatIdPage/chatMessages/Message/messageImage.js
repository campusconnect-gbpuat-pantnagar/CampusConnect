import styles from "./message.module.css";
export const MessageImage = ({ image }) => {
  return (
    <div className={styles.messageImage}>
      <a href={image} alt="image_Link" target="_blank" rel="noreferrer">
        <img src={image} alt="message_image" />
      </a>
    </div>
  );
};
