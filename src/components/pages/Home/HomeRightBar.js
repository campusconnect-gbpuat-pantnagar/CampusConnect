import { Grid } from "@material-ui/core"
import React from "react"
import { UpdateCard } from "../Home/Update/UpdateCard"
import { PollCard } from "./Poll/PollCard"

export const HomeRightBar = () => {
  return (
    <div className="home-right-bar">
      <Grid container direction="column" justifyContent="center">
        <PollCard />
        <UpdateCard />
      </Grid>
    </div>
  )
}
