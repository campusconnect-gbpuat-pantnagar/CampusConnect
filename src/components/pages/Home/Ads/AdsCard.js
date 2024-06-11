import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Fade,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

import React, { useContext, useState, useEffect } from "react";
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";
import { AdsContext } from "../../../../context/adsContext/AdsContext";
import { AuthContext } from "../../../../context/authContext/authContext";
import { UserContext } from "../../../../context/userContext/UserContext";
import { API, CDN_URL } from "../../../../utils/proxy";
import { AdsModal } from "../../Modals/AdsModal";
import { NewAuthContext } from "../../../../context/newAuthContext";
import { ThemeContext } from "../../../../context/themeContext";
import ServiceConfig from "../../../../helpers/service-endpoint";
import HttpRequestPrivate from "../../../../helpers/private-client";
import CustomCarousel from "../../../common/custom-carousel/custom-carousel";
import adsCardStyles from "./ads.module.css";
import { Delete } from "@material-ui/icons";
export const AdsCard = ({ ads, deleteHandler }) => {
  const navigate = useNavigate();
  const [bookmarkStatus, setBookmarkStatus] = useState(false);
  const [moreOption, setMoreOption] = useState(false);
  const { user, tokens } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const [adsUser, setAdsUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  console.log(ads);
  const getUserById = async () => {
    try {
      setIsLoading(true);
      const requestOptions = {
        url: `${ServiceConfig.userEndpoint}/profile/${ads.userId}`,
        method: "GET",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };

      const response = await HttpRequestPrivate(requestOptions);
      if (response.data.data && response.data.data.user) {
        console.log(user, "user profile by userId");
        setAdsUser(response.data.data.user);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getUserById();
  }, [ads.userId]);

  // const handleBookmarkBtn = () => {
  //   handleClose();
  //   const formData = {
  //     type: ads.objType,
  //     typeId: ads._id,
  //   };
  //   if (!bookmarkStatus) {
  //     userContext.bookmarkItem(authContext.user._id, formData);
  //     setBookmarkStatus(true);
  //   } else {
  //     userContext.unBookmarkItem(authContext.user._id, formData);
  //     setBookmarkStatus(false);
  //   }
  // };

  const open = Boolean(moreOption);
  const handleClose = () => {
    setMoreOption(false);
  };
  const [showAds, setShowAds] = useState(false);

  const handleModalAds = () => {
    // handleClose();
    setShowAds(!showAds);
  };

  const styleTheme =
    theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "white", color: "black" };

  const handleMoreOption = () => {
    setMoreOption(true);
  };
  return (
    <Card variant="elevation" elevation={3} className="mb-3" style={styleTheme}>
      {showAds && (
        <AdsModal
          show={showAds}
          handleModal={handleModalAds}
          // adsFunction={adsContext.updateAd}
          modalTitle="Update Ad"
          ads={ads}
        />
      )}
      <CardHeader
        avatar={
          <Avatar alt={adsUser?.firstName} src={`${adsUser?.profilePicture}`} />
        }
        action={
          <>
            {user.id === ads.userId && (
              <button
                onClick={() => deleteHandler(ads.id)}
                style={{
                  color: "red",
                  border: "none",
                  padding: "5pxs",
                  fontSize: "16px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                <Delete />
              </button>
            )}
          </>
          //   <>
          //     <IconButton
          //       aria-label="settings"
          //       onClick={handleMoreOption}
          //       style={styleTheme}
          //     >
          //       <MoreHorizIcon />
          //     </IconButton>
          //     <Menu
          //       id="fade-menu"
          //       anchorEl={moreOption}
          //       keepMounted
          //       open={open}
          //       onClose={handleClose}
          //       TransitionComponent={Fade}
          //       PaperProps={{ style: { backgroundColor: styleTheme.background } }}
          //     >
          //       {user.id === ads.userId ? (
          //         <MenuItem onClick={handleModalAds} style={styleTheme}>
          //           Edit
          //         </MenuItem>
          //       ) : null}
          //       {user.id === ads.userId ? (
          //         <MenuItem onClick={() => {}} style={styleTheme}>
          //           Delete
          //         </MenuItem>
          //       ) : null}
          //       {/* <MenuItem onClick={handleClose} style={styleTheme}>
          //         Share
          //       </MenuItem> */}

          //       {/* <MenuItem onClick={handleClose} style={styleTheme}>
          //         Report Post
          //       </MenuItem> */}
          //     </Menu>
          //   </>
        }
        title={
          <b
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate(`/profile/${adsUser?.username}`);
            }}
          >
            {`${adsUser?.firstName}`}
          </b>
        }
        subheader={
          <Moment style={styleTheme} fromNow>
            {ads.createdAt}
          </Moment>
        }
      />
      <CardContent className="py-1">
        <Typography variant="body1" component="p">
          {ads.title}
        </Typography>
        <Typography variant="body2" component="p">
          {ads.content}
        </Typography>
        <Typography variant="subtitle1" component="p">
          Price: Rs. {ads.price}
        </Typography>
        <Typography variant="subtitle1" component="p">
          {ads.contact}
        </Typography>
        {ads.media.length > 0 && (
          <Grid
            item
            className={adsCardStyles.postCarousel}
            style={{ margin: "1rem 0", height: "300px" }}
          >
            <div
              style={{
                margin: "auto",
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <CustomCarousel slides={ads.media} />
            </div>
          </Grid>
        )}
        {/* <div className="centered-image-container">
    
          {ads.picture.length > 0 && (
            <img
              className="centered-image"
              height="100%"
              src={`https://campusconnect-cp84.onrender.com/${ads.picture[0]}`}
              alt="ad.png"
            />
          )}
        </div> */}
      </CardContent>
    </Card>
  );
};
