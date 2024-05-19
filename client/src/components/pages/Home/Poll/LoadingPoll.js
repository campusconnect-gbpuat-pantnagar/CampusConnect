import React, { useContext } from "react";
import { AuthContext } from "../../../../context/authContext/authContext";
import { Button, ButtonGroup, Card, CardContent, CardHeader } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

export const LoadingPoll = () => {
  const authContext = useContext(AuthContext)
  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : null;

  return (
    <div>
      <Card variant="elevation" elevation={3} style={styleTheme}>
      <CardHeader
        avatar={
          <Skeleton animation="wave" variant="circle" width={40} height={40} />
        }
        action={null}
        title={
          <Skeleton
            animation="wave"
            height={10}
            width="80%"
            style={{ marginBottom: 6 }}
          />
        }
        subheader={<Skeleton animation="wave" height={10} width="40%" />}
      />
      <CardContent style={{paddingTop: "0px"}}>
        <Skeleton animation="wave" height={8} />
      </CardContent>
      <ButtonGroup fullWidth variant="outlined" className="pr-3 pl-3 pb-2">
        <Button size="small">
          <Skeleton
            animation="wave"
            height={10}
            width="100%"
          />
        </Button>
      </ButtonGroup>
      <ButtonGroup fullWidth variant="outlined" className="pr-3 pl-3 pb-2">
        <Button size="small">
          <Skeleton
            animation="wave"
            height={10}
            width="100%"
          />
        </Button>
      </ButtonGroup>
      <ButtonGroup fullWidth variant="outlined" className="pr-3 pl-3 pb-2">
        <Button size="small">
          <Skeleton
            animation="wave"
            height={10}
            width="100%"
          />
        </Button>
      </ButtonGroup>
      <ButtonGroup fullWidth variant="outlined" className="pr-3 pl-3 pb-2">
        <Button size="small">
          <Skeleton
            animation="wave"
            height={10}
            width="100%"
          />
        </Button>
      </ButtonGroup>
    </Card>
    </div>
  )
}