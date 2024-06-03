import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useContext } from "react";
import { AuthContext } from "../context/authContext/authContext";
import { NewAuthContext } from "../context/newAuthContext";

export const EmojiPicker = ({ onChange }) => {
  const { theme } = useContext(NewAuthContext);
  return (
    <Picker
      data={data}
      theme={theme}
      onEmojiSelect={(emoji) => onChange((prev) => `${prev}${emoji.native}`)}
    />
  );
};
