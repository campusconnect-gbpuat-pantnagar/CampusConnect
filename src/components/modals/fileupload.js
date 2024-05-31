import React, { useContext, useState } from "react";
import { ModalContext } from "../../context/modalContext";
import styles from "./deleteoredit-modal.module.css";
import fileUploadstyles from "./fileupload.module.css";
import { ModalType } from "../../context/modalContext/modalTypes";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../../utils/config/firebase";
import { ChatContext } from "../../context/chatContext/chatContext";
import { AuthContext } from "../../context/authContext/authContext";
import FileUploadIcon from "@material-ui/icons/CloudUpload";
import CancelIcon from "@material-ui/icons/Cancel";
import PdfIcon from "@material-ui/icons/FileCopy";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
const FileUpload = () => {
  const { modalState, setModalState, onClose } = useContext(ModalContext);
  const { chatId, talkingWithId, setIsLoading, isLoading } =
    useContext(ChatContext);
  const authContext = useContext(AuthContext);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadItemFromUrl, setUploadItemFromUrl] = useState("");
  const [uploadItemFile, setUploadItemFile] = useState("");
  const isCurrentModalOpen =
    modalState.type === ModalType.FileUpload && modalState.open;

  if (!isCurrentModalOpen) {
    return null;
  }

  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#151515", color: "white" }
      : { background: "white", color: "black" };

  const fileUploadHandler = (event) => {
    event.preventDefault();
    console.log(event);

    const file = event.target.files[0];
    console.log(file);
    setUploadItemFile(file);
  };

  const resetHandler = () => {
    if (!isLoading) {
      setUploadItemFile("");
      setUploadItemFromUrl("");
      setUploadProgress(0);
    }
  };

  const ModalCloseHandler = () => {
    if (!isLoading) {
      onClose();
      resetHandler();
      setIsLoading(false);
    }
  };

  const fileSaveHandler = async () => {
    if (uploadItemFromUrl) {
      setIsLoading(true);
      modalState?.data?.function({
        messageType: modalState?.data?.messageType,
        downloadLink: uploadItemFromUrl,
      });
      ModalCloseHandler();
    }

    if (uploadItemFile) {
      setIsLoading(true);
      try {
        const metaData = {
          contentType: uploadItemFile.type,
        };

        const storageRef = ref(
          storage,
          `${modalState?.data?.messageType}/` + uploadItemFile.name
        );
        const uploadTask = uploadBytesResumable(
          storageRef,
          uploadItemFile,
          metaData
        );
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            setIsUploading(true);
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log("Upload is " + progress + "% done");
            setUploadProgress(progress);
          },
          (error) => {
            console.log(error);
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
              setIsUploading(false);
              ModalCloseHandler();
              modalState?.data.function({
                messageType: modalState?.data?.messageType,
                downloadLink: downloadURL,
              });
            });

            resetHandler();
          }
        );
      } catch (err) {
        console.log(err);
      } finally {
      }
    }
  };

  return (
    <div className={styles.modal}>
      <div onClick={ModalCloseHandler} className={styles.modalDropShadow}></div>
      <div
        className={`${styles.ModalContainer} ${fileUploadstyles.ModalContainer}`}
        style={styleTheme}
      >
        <div className={styles.modalheader}>
          <h2>{`Upload ${modalState.data?.name}`}</h2>

          {!uploadItemFile && !uploadItemFromUrl && (
            <div className={fileUploadstyles.uploadImageContainer}>
              <div>
                <span>{`${modalState.data?.urlLabel}`}</span>
                <input
                  value={uploadItemFromUrl}
                  onChange={(e) => setUploadItemFromUrl(e.target.value)}
                  type="text"
                  className={fileUploadstyles.Imageurl}
                  alt="imageUrl"
                  placeholder="paste image url"
                />
              </div>
              <div className={fileUploadstyles.linebreak}>
                <span></span>
                <p>or</p>
                <span></span>
              </div>
              <div>
                <span>{modalState?.data?.inputLabel}</span>
                <div className={fileUploadstyles.addFromDevice}>
                  <FileUploadIcon />
                  <input
                    type="file"
                    name={modalState.data?.messageType}
                    accept={modalState.data?.accept}
                    value={uploadItemFile}
                    onChange={fileUploadHandler}
                  />
                </div>
              </div>
            </div>
          )}

          {(uploadItemFile || uploadItemFromUrl) &&
            modalState.data?.messageType === "image" && (
              <div className={fileUploadstyles.uploadImageContainer}>
                <div className={fileUploadstyles.uploadItemImg}>
                  <img
                    src={
                      uploadItemFromUrl
                        ? uploadItemFromUrl
                        : window.URL.createObjectURL(uploadItemFile)
                    }
                    alt="uploaditem"
                  />
                  <CancelIcon disabled={isLoading} onClick={resetHandler} />
                </div>
                {isUploading && (
                  <div className={fileUploadstyles.uploadFileProgress}>
                    {/* <progress id="file" value={uploadProgress} max="100">
                    {uploadProgress}
                  </progress> */}{" "}
                    <span>{`${uploadProgress}% uploaded`}</span>
                  </div>
                )}
              </div>
            )}
          {(uploadItemFile || uploadItemFromUrl) &&
            modalState.data?.messageType === "document" && (
              <div className={fileUploadstyles.uploadImageContainer}>
                <div className={fileUploadstyles.docsInfo}>
                  <div className={fileUploadstyles.docsImage}>
                    <img
                      src="https://images.unsplash.com/photo-1682687982468-4584ff11f88a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="message_image"
                    />
                  </div>
                  <div className={fileUploadstyles.docsName}>
                    <span className={fileUploadstyles.docsIcon}>
                      <PdfIcon />
                    </span>
                    <p>{uploadItemFile?.name}</p>
                  </div>
                  <CancelIcon onClick={resetHandler} />
                </div>
                {isUploading && (
                  <div className={fileUploadstyles.uploadFileProgress}>
                    {/* <progress id="file" value={uploadProgress} max="100">
                    {uploadProgress}
                  </progress> */}{" "}
                    <span>{`${uploadProgress}% uploaded`}</span>
                  </div>
                )}
              </div>
            )}
        </div>
        <div className={`${styles.modalbuttons}`}>
          <button disabled={isLoading} onClick={fileSaveHandler}>
            {isLoading && <span className={fileUploadstyles.loader}></span>}
            <span>{modalState?.data?.buttonText}</span>
          </button>

          <button
            disabled={isLoading}
            className={styles.CancelButton}
            onClick={ModalCloseHandler}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
