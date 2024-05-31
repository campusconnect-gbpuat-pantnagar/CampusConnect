import styles from "./message.module.css";
export const MessageText = ({ text }) => {
  const isMessageOnlyEmoji = (text) => {
    const emojiRegex = new RegExp(/[\p{Emoji}]/u);
    return emojiRegex.test(text);
  };

  const isOnlyEmoji = isMessageOnlyEmoji(text);
  if (text.length === 2 && isOnlyEmoji) {
    return <span className={styles.singleEmoji}>{text}</span>;
  }

  if (text.length === 4 && isOnlyEmoji) {
    return <span className={styles.doubleEmoji}>{text}</span>;
  }

  return <p style={{ whiteSpace: "pre-line" }}>{text}</p>;
};
