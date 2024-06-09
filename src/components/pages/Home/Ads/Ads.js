import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { AdsContext } from "../../../../context/adsContext/AdsContext";
import { UserContext } from "../../../../context/userContext/UserContext";
import { Home } from "../../../common/Base/Home";
import { AdsCard } from "./AdsCard";
import { LoadingAds } from "./LoadingAds";
import HttpRequestPrivate from "../../../../helpers/private-client";
import { toast } from "react-toastify";
import { NewAuthContext } from "../../../../context/newAuthContext";
import { ThemeContext } from "../../../../context/themeContext";
import ServiceConfig from "../../../../helpers/service-endpoint";

export const Ads = () => {
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, tokens } = useContext(NewAuthContext);
  const userContext = useContext(UserContext);
  const { theme } = useContext(ThemeContext);

  async function getAds() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: ServiceConfig.adEndpoint,
        method: "GET",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);
      console.log(response);
      setIsLoading(false);

      if (response.data.data) {
        setAds(response.data.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  useEffect(() => {
    getAds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteAds = async (adsId) => {
    try {
      const updatedAds = ads.filter((ad) => ad.id !== adsId);
      setAds(updatedAds);
      const requestOptions = {
        url: `${ServiceConfig.adEndpoint}/${adsId}`,
        method: "DELETE",
        showActual: true,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${tokens?.access_token}`, // Assuming 'userToken' holds the token
        },
      };
      const response = await HttpRequestPrivate(requestOptions);
      if (response.data.data) {
        toast.success(response.data.message, {
          theme: `${theme === "dark" ? "dark" : "light"}`,
        });
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message, {
        theme: `${theme === "dark" ? "dark" : "light"}`,
      });
    }
  };

  const updateBlogList = (ads) => {
    if (ads) {
      const updateAdsList = ads.map((ad) => (ad.id === ads.id ? ads : ad));
      setAds(updateAdsList);
    }
  };
  return (
    <Home>
      <div className="px-2">
        {isLoading ? (
          <LoadingAds />
        ) : ads.length > 0 ? (
          ads.map((ads) => {
            return (
              <div key={ads.id}>
                <AdsCard deleteHandler={deleteAds} ads={ads} />
              </div>
            );
          })
        ) : (
          <div
            className="m-auto"
            style={{
              height: "30vh",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid
              container
              spacing={3}
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <FontAwesomeIcon icon={faPencilAlt} fontSize="large" />
              <h6 className="mt-2">No ads out there</h6>
            </Grid>
          </div>
        )}
      </div>
    </Home>
  );
};
