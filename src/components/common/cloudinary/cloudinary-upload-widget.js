import { useEffect, useRef } from "react";
import styles from "./cuw.module.css";

const CloudinaryUploadWidget = ({ setMediaFiles }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "hzxyensd5",
        uploadPreset: "aoh4fpwm",
        multiple: true, // Allow multiple file uploads
        maxFileSize: 20000000, // Set maximum file size to 20MB
        accept: "image/*,v ideo/*", // Only allow image and video files
      },
      function (error, result) {
        if (error) {
          alert("Error uploading files:", error);
          setMediaFiles([]);
        }
        if (result && result.event === "success") {
          console.log(result.info);
          const uploadedFiles =
            result.event === "success"
              ? {
                  url: result.info.secure_url,
                  format: result.info.format,
                  publicId: result.info.public_id,
                  resource_type: result.info.resource_type,
                  thumbnail_url: result.info.thumbnail_url,
                  asset_id: result.info.asset_id,
                }
              : {};
          setMediaFiles((prevMediaFiles) => [...prevMediaFiles, uploadedFiles]);
        }
      }
    );
  }, [setMediaFiles]);
  return (
    <>
      <button
        id="upload_widget"
        className={styles.cuw_button}
        onClick={() => widgetRef.current.open()}
      >
        Upload
      </button>
    </>
  );
};

export default CloudinaryUploadWidget;
