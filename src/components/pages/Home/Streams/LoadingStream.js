import React, { useContext } from "react"
import { Card, CardContent, CardHeader } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"
import { AuthContext } from "../../../../context/authContext/authContext"

export const LoadingStream = () => {
  const authContext = useContext(AuthContext)
  const styleTheme =
    authContext.theme === "dark"
      ? { background: "#121212", color: "whitesmoke" }
      : null

  return (
    <Card variant="elevation" elevation={3} style={styleTheme}>
      <Skeleton
        animation="wave"
        variant="rect"
        style={{ width: "100%", height: "250px" }}
      />
      <CardHeader
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
      <CardContent>
        <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
        <Skeleton animation="wave" height={10} width="80%" />
      </CardContent>
    </Card>
  )
}
