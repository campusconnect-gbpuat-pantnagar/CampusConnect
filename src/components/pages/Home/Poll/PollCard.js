import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Avatar,
} from "@material-ui/core";
import { Carousel } from "react-bootstrap";
import { PollContext } from "../../../../context/pollContext/PollContext";
import { LoadingPoll } from "./LoadingPoll";
import { API } from "../../../../utils/proxy";
import { useNavigate } from "react-router-dom";
import Moment from "react-moment";
import DeleteIcon from "@material-ui/icons/Delete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleRight,
  faChevronCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { NewAuthContext } from "../../../../context/newAuthContext";
import { ThemeContext } from "../../../../context/themeContext";
import ServiceConfig from "../../../../helpers/service-endpoint";
import HttpRequestPrivate from "../../../../helpers/private-client";
import PollSubCard from "./poll-sub-card";

export const PollCard = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const { user, tokens } = useContext(NewAuthContext);
  const { theme } = useContext(ThemeContext);
  const pollContext = useContext(PollContext);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [index, setIndex] = useState(0);
  const [responseValue, setResponseValue] = useState({
    loading: false,
    error: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [polls, setPolls] = useState([]);

  async function getAllPolls() {
    setIsLoading(true);
    try {
      const requestOptions = {
        url: ServiceConfig.pollsEndpoint,
        method: "GET",
        showActual: true,
        withCredentials: true,
      };
      const response = await HttpRequestPrivate(requestOptions);
      console.log(response);
      setIsLoading(false);
      if (response.data.data) {
        setPolls(response.data.data);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }

  useEffect(() => {
    getAllPolls();
  }, [isRefreshing]);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const handlePrev = () => {
    ref.current.prev();
  };

  const handleNext = () => {
    ref.current.next();
  };

  const handlePollClick = async (e, option, pollId) => {
    e.preventDefault();

    // console.log(option, pollId);
    console.log(polls);
    // try {
    //   const requestOptions = {
    //     url: `${ServiceConfig.pollsEndpoint}/${pollId}/{op}`,
    //     method: "GET",
    //     showActual: true,
    //     withCredentials: true,
    //   };
    //   const response = await HttpRequestPrivate(requestOptions);
    //   console.log(response);
    //   setIsLoading(false);
    //   if (response.data.data) {
    //     // console.log(response.data.data);
    //     setPolls(response.data.data);
    //   }
    // } catch (err) {
    //   setIsLoading(false);
    //   console.log(err);
    // }
  };

  const handlePollDelete = async (pollId) => {
    try {
      await pollContext.deletePoll(user.id, pollId);
    } catch (error) {
      console.log("Error deleting poll:", error);
    }
  };

  const styleTheme =
    theme === "dark"
      ? {
          background: "#121212",
          color: "whitesmoke",
          borderColor: "whitesmoke",
        }
      : { background: "white", color: "black", borderColor: "black" };

  const styleTheme2 =
    theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : { background: "whitesmoke", color: "black" };

  return (
    <div className="poll-card">
      {isLoading ? (
        <LoadingPoll />
      ) : (
        <Grid container direction="column">
          <Grid container justifyContent="space-between">
            <Grid item>
              <h6>
                <b>Polls</b>
              </h6>
            </Grid>
            <Grid item className="poll-arrow">
              <IconButton
                onClick={() => handlePrev()}
                style={{ cursor: "pointer" }}
                size="small"
                className="mr-2"
              >
                <FontAwesomeIcon
                  icon={faChevronCircleLeft}
                  style={styleTheme2}
                />
              </IconButton>
              <IconButton
                onClick={() => handleNext()}
                style={{ cursor: "pointer" }}
                size="small"
                className="mr-1"
              >
                <FontAwesomeIcon
                  icon={faChevronCircleRight}
                  style={styleTheme2}
                />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item>
            <Card
              variant="elevation"
              elevation={3}
              className="pb-3"
              style={styleTheme}
            >
              <Carousel
                ref={ref}
                indicators={false}
                controls={false}
                activeIndex={index}
                onSelect={handleSelect}
              >
                {polls.length > 0 ? (
                  polls.map((poll, index) => {
                    return (
                      // <Carousel.Item>
                      //   <Grid>
                      //     <Grid
                      //       container
                      //       direction="row"
                      //       className="m-1"
                      //       justifyContent="space-between"
                      //     >
                      //       <Grid>
                      //         <Grid container direction="row">
                      //           <Grid item>
                      //             <Avatar
                      //               alt={"pollUser?.firstName"}
                      //               src={`${"pollUser?.profilePicture"}`}
                      //               className="mt-2 ml-2"
                      //             />
                      //           </Grid>
                      //           <Grid item>
                      //             <Grid
                      //               container
                      //               direction="column"
                      //               className="ml-2 mt-1"
                      //             >
                      //               <Grid>
                      //                 <b
                      //                   style={{
                      //                     ...styleTheme,
                      //                     fontSize: "smaller",
                      //                     cursor: "pointer",
                      //                   }}
                      //                   onClick={() => {
                      //                     navigate(
                      //                       `/profile/${"pollUser?.username"}`
                      //                     );
                      //                   }}
                      //                 >
                      //                   {`${"pollUser?.firstName"} `}
                      //                 </b>
                      //               </Grid>
                      //               <Grid>
                      //                 <Moment
                      //                   fromNow
                      //                   style={{
                      //                     ...styleTheme,
                      //                     fontSize: "smaller",
                      //                   }}
                      //                 >
                      //                   {poll.created}
                      //                 </Moment>
                      //               </Grid>
                      //             </Grid>
                      //           </Grid>
                      //         </Grid>
                      //       </Grid>
                      //       <Grid>
                      //         {user.id === poll?.userId ? (
                      //           <IconButton
                      //             aria-label="settings"
                      //             // onClick={() => handlePollDelete(poll?._id)}
                      //             style={styleTheme}
                      //           >
                      //             <DeleteIcon />
                      //           </IconButton>
                      //         ) : null}
                      //       </Grid>
                      //     </Grid>
                      //   </Grid>
                      //   <CardContent
                      //     className="mt-2"
                      //     style={{
                      //       paddingTop: "0px",
                      //       paddingBottom: "0",
                      //       ...styleTheme,
                      //     }}
                      //   >
                      //     <Typography
                      //       variant="body1"
                      //       style={{ padding: "0", ...styleTheme }}
                      //     >
                      //       {poll.title}
                      //     </Typography>
                      //     <Typography
                      //       variant="body2"
                      //       color="textSecondary"
                      //       style={{ paddingTop: "0px", ...styleTheme }}
                      //     >
                      //       {poll?.options?.some((option) =>
                      //         option.votes.includes(user.id)
                      //       )
                      //         ? poll?.options?.map((option, index) => (
                      //             <div key={index}>
                      //               <Button
                      //                 variant="outlined"
                      //                 className="mt-2"
                      //                 size="small"
                      //                 style={{
                      //                   ...styleTheme,
                      //                   width: "100%",
                      //                   borderRadius: "4px",
                      //                   overflow: "hidden",
                      //                   position: "relative",
                      //                 }}
                      //                 disabled
                      //               >
                      //                 <div
                      //                   style={{
                      //                     position: "absolute",
                      //                     top: 0,
                      //                     left: 0,
                      //                     backgroundColor: "#4b9de4",
                      //                     height: "100%",
                      //                     width: `${Math.round(
                      //                       (option.votes.length /
                      //                         poll.totalVotes.length) *
                      //                         100
                      //                     )}%`,
                      //                   }}
                      //                 />
                      //                 <div
                      //                   style={{
                      //                     position: "relative",
                      //                     zIndex: 1,
                      //                     color: `${
                      //                       theme === "dark" ? "white" : "black"
                      //                     }`,
                      //                     textAlign: "center",
                      //                   }}
                      //                 >
                      //                   <span
                      //                     style={{ textTransform: "initial" }}
                      //                   >
                      //                     {option.text}
                      //                   </span>{" "}
                      //                   {Math.round(
                      //                     (option.votes.length /
                      //                       poll.totalVotes.length) *
                      //                       100
                      //                   )}
                      //                   %
                      //                 </div>
                      //               </Button>
                      //             </div>
                      //           ))
                      //         : poll?.options?.map((option, index) => (
                      //             <div key={index}>
                      //               <Button
                      //                 variant="outlined"
                      //                 className="mt-2"
                      //                 size="small"
                      //                 style={styleTheme}
                      //                 onClick={(e) =>
                      //                   handlePollClick(e, option, poll?._id)
                      //                 }
                      //                 fullWidth
                      //               >
                      //                 <span
                      //                   style={{ textTransform: "initial" }}
                      //                 >
                      //                   {option.text}
                      //                 </span>
                      //               </Button>
                      //             </div>
                      //           ))}
                      //     </Typography>
                      //   </CardContent>
                      // </Carousel.Item>
                      <PollSubCard
                        setIsRefreshing={setIsRefreshing}
                        poll={poll}
                        index={index}
                        key={index}
                      />
                    );
                  })
                ) : (
                  <div
                    className="m-auto"
                    style={{
                      height: "20vh",
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
                      <h6 className="mt-2">No poll out there</h6>
                    </Grid>
                  </div>
                )}
              </Carousel>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};
