import { Grid } from "@material-ui/core";
import React from "react";
import ConnectionCardLoadingStyles from "./connection-loading.module.css";
import ConnectionCardStyles from "./connectionCard.module.css";
export const ConnectionLoadingCard = () => {
  return (
    <div className={ConnectionCardStyles.CardContainer}>
      <div
        className={`${ConnectionCardStyles.profilePicture} ${ConnectionCardLoadingStyles.loadingSkeleton}`}
      />
      <div className={ConnectionCardStyles.UserDetails}>
        <span
          className={ConnectionCardLoadingStyles.loadingSkeleton}
          style={{ width: "70%" }}
        />
        <span
          className={ConnectionCardLoadingStyles.loadingSkeleton}
          style={{ width: "50%" }}
        />
      </div>
      <div className={ConnectionCardStyles.academicDetails}>
        <span
          className={ConnectionCardLoadingStyles.loadingSkeleton}
          style={{ width: "60%" }}
        />
        <span
          className={ConnectionCardLoadingStyles.loadingSkeleton}
          style={{ width: "40%" }}
        />
      </div>
      <div className={ConnectionCardStyles.ActionButtons}>
        <div
          className={ConnectionCardLoadingStyles.loadingSkeleton}
          style={{ width: "100%", height: "35px" }}
        />
        <div
          className={ConnectionCardLoadingStyles.loadingSkeleton}
          style={{ width: "100%", height: "35px" }}
        />
      </div>
    </div>
  );
};
