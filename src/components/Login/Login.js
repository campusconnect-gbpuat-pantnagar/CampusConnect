import { Box, Button, Grid, Paper, TextField } from "@material-ui/core"
import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/authContext/authContext"
import { UserContext } from "../../context/userContext/UserContext"
import { useServiceWorker } from "../../context/ServiceWorkerContext";
import "./Login.css"
export const Login = () => {
  const { isReady } = useServiceWorker()
  const navigate = useNavigate()
  const userContext = useContext(UserContext)
  const authContext = useContext(AuthContext)

  const [inputValues, setInputValues] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setInputValues({
      ...inputValues,
      [name]: value,
    })
  }
  const formData = {
    email: inputValues.email,
    password: inputValues.password,
  }
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    await authContext.signinUser(formData)
  }

  return (
    <>
      <div className="login">
        <div className="container">
          <Grid
            container
            alignItems="center"
            justifyContent="space-around"
            direction="row"
          >
            <Grid container justifyContent="center" alignItems="center">
              <Grid item>
                <img src="cc_logo.png" height={"220px"} alt="logo" className="mb-3" />
              </Grid>
            </Grid>
            <Grid item className="text-center">
              <Paper elevation={3}>
                <Box py={6} px={3} width="400px">
                  <form onSubmit={handleFormSubmit}>
                    <Grid
                      spacing={1}
                      container
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid item container>
                        <TextField
                          type="email"
                          name="email"
                          fullWidth
                          value={inputValues.email}
                          onChange={handleChange}
                          variant="outlined"
                          size="small"
                          label="Email"
                        />
                      </Grid>
                      <Grid item container>
                        <TextField
                          fullWidth
                          name="password"
                          value={inputValues.password}
                          onChange={handleChange}
                          type="password"
                          size="small"
                          variant="outlined"
                          label="Password"
                        />
                      </Grid>
                      <Grid item container>
                        <Button
                          color="primary"
                          fullWidth
                          size="large"
                          variant="contained"
                          type="submit"
                        >
                          Login
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                  <Box my={2}>
                    <Grid
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                      container
                      direction="row"
                    >
                      <Grid item>
                        <Button
                          variant="text"
                          style={{
                            textTransform: "none",
                          }}
                        >
                          Forgot password
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          onClick={() => {
                            navigate("/signup")
                          }}
                          variant="contained"
                          style={{
                            color: "#fff",
                            background: "rgb(35 75 167)",
                          }}
                        >
                          Create Account
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  )
}
