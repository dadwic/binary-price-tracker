import * as React from "react";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import LinearProgress from "@mui/material/LinearProgress";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import Typography from "@mui/material/Typography";
import Footer from "./Footer";

export default function Tracker() {
  const [quote, setQuote] = React.useState("0");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  // List of markets
  const [markets, setMarkets] = React.useState([]);
  const [market, setMarket] = React.useState("");
  // List of symbols
  const [symbols, setSymbols] = React.useState([]);
  const [symbol, setSymbol] = React.useState("");

  // Markets socket
  var ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");

  ws.onopen = function (e) {
    ws.send(JSON.stringify({ active_symbols: "brief", product_type: "basic" }));
    if (symbol) {
      ws.send(
        JSON.stringify({
          ticks: symbol,
          subscribe: 1,
        })
      );
    }
  };

  ws.onmessage = function (msg) {
    var data = JSON.parse(msg.data);
    try {
      if ((data.event = "data")) {
        if ((data.msg_type = "active_symbols")) {
          setLoading(false);
          setMarkets([...markets, ...(data?.active_symbols || [])]);
        }
        if ((data.msg_type = "tick")) {
          setLoading(false);
          if (data.error) setError(data.error.message);
          if (data.tick) setQuote(`${data.tick?.quote || 0}`);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeMarket = (event) => {
    setMarket(event.target.value);
  };

  const handleChangeSymbol = (event) => {
    setSymbol(event.target.value);
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
        {loading && <LinearProgress />}
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
              disabled={loading}
              margin="normal"
              label="Markets"
              id="markets"
              name="markets"
              value={market}
              onChange={handleChangeMarket}
            >
              {markets.map((m, key) => (
                <MenuItem key={key} value={m.symbol}>
                  {m.market_display_name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              disabled={loading}
              margin="normal"
              label="Symbols"
              name="symbols"
              id="symbols"
              value={symbol}
              onChange={handleChangeSymbol}
            >
              <MenuItem value={market}>{market}</MenuItem>
            </TextField>
            <TextField
              fullWidth
              disabled
              margin="normal"
              label="Current price of the symbol"
              name="current-price"
              id="current-price"
              value={quote}
            />
            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}
            <Footer />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
