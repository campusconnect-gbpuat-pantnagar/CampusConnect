import styles from "./message.module.css";
import PdfIcon from "@material-ui/icons/FileCopy";
export const MessageDoc = ({ document }) => {
  const urlParts = document.split("/");

  const lastPart = urlParts[urlParts.length - 1];

  const decodedLastPart = decodeURIComponent(lastPart);

  const documentName = decodedLastPart.split("?")[0].split("/")[1];
  return (
    <div className={styles.messageDocs}>
      <div className={styles.docsInfo}>
        <a
          target="_blank"
          rel="noreferrer"
          href={document}
          className={styles.docsImage}
        >
          <img
            src="https://firebasestorage.googleapis.com/v0/b/campus-connect-90a41.appspot.com/o/image%2Fpdf%20image.png?alt=media&token=730de48c-8548-4f18-8003-0827b0b97105"
            alt="message_image"
          />
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          href={document}
          className={styles.docsName}
        >
          <span className={styles.docsIcon}>
            <PdfIcon />
          </span>
          <p>{documentName}</p>
        </a>
      </div>
      <div className={styles.docsButtons}>
        {/* two button */}
        <a
          href={document}
          target="_blank"
          rel="noreferrer"
          className={styles.button}
        >
          Open
        </a>
        <a href={document} download={document}>
          Save as..
        </a>
      </div>
    </div>
  );
};
