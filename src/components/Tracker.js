import * as React from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import Typography from "@mui/material/Typography";
import Footer from "./Footer";

export default function Tracker() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          background: "url(/images/bg.svg) center center/cover no-repeat",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) => t.palette.grey[50],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <GpsFixedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Price Tracker
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <TextField
              select
              fullWidth
              margin="normal"
              label="Markets"
              id="markets"
              name="markets"
            />
            <TextField
              select
              fullWidth
              margin="normal"
              label="Symbols"
              name="symbols"
              id="symbols"
            />
            <TextField
              fullWidth
              disabled
              margin="normal"
              label="Current price of the symbol"
              name="current-price"
              id="current-price"
              defaultValue="0.0"
            />
            <Footer />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
