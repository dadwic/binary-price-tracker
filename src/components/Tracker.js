import * as React from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import Typography from "@mui/material/Typography";
import Footer from "./Footer";

export default function Tracker() {
  const [markets, setMarkets] = React.useState([]);
  var ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");

  ws.onopen = function (e) {
    ws.send(JSON.stringify({ active_symbols: "brief", product_type: "basic" }));
  };

  ws.onmessage = function (msg) {
    var data = JSON.parse(msg.data);
    try {
      if ((data.event = "data")) {
        setMarkets(data.active_symbols);
      }
    } catch (err) {
      console.log(err);
    }
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
          <Box noValidate component="form" sx={{ mt: 3 }}>
            <TextField
              select
              fullWidth
              margin="normal"
              label="Markets"
              id="markets"
              name="markets"
            >
              {markets.map((market, key) => (
                <MenuItem key={key}>{market.market_display_name}</MenuItem>
              ))}
            </TextField>
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
