import React, { useContext } from "react";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { AuthContext } from "../../../../context/authContext/authContext";
import { ThemeContext } from "../../../../context/themeContext";

export const LoadingPost = () => {
  const { theme } = useContext(ThemeContext);
  const styleTheme =
    theme === "dark" ? { background: "#121212", color: "whitesmoke" } : null;

  return (
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
      <Skeleton
        animation="wave"
        variant="rect"
        style={{ width: "100%", height: "250px" }}
      />
      <CardContent>
        <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
        <Skeleton animation="wave" height={10} width="80%" />
      </CardContent>
    </Card>
  );
};
