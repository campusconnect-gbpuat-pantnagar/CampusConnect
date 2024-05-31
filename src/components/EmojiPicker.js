import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useContext } from "react";
import { AuthContext } from "../context/authContext/authContext";

export const EmojiPicker = ({ onChange }) => {
  const authContext = useContext(AuthContext);
  return (
    <Picker
      data={data}
      theme={authContext.theme}
      onEmojiSelect={(emoji) => onChange((prev) => `${prev}${emoji.native}`)}
    />
  );
};
