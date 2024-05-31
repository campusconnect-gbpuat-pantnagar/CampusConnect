import React from "react";
import DeleteOrEditModal from "../modals/deleteoredit-modal";
import ChatWallpaper from "../modals/chatwallpaper";
import FileUpload from "../modals/fileupload";

const ModalProvider = () => {
  return (
    <>
      <DeleteOrEditModal />
      <ChatWallpaper />
      <FileUpload />
    </>
  );
};

export default ModalProvider;
