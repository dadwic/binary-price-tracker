import React, { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import CircleIcon from "@mui/icons-material/SwapVerticalCircle";
import LinearProgress from "@mui/material/LinearProgress";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import { priceFormat } from "utils";
import Footer from "./Footer";

export default function Tracker() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // Market states
  const [tick, setTick] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [market, setMarket] = useState({ symbol: "" });
  const { sendJsonMessage, lastMessage, readyState, getWebSocket } =
    useWebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089", {
      shouldReconnect: () => true,
    });

  useEffect(() => {
    sendJsonMessage({ active_symbols: "brief", product_type: "basic" });
  }, []);

  useEffect(() => {
    if (lastMessage !== null) {
      setLoading(false);
      const { msg_type, ...data } = JSON.parse(lastMessage.data);
      if (msg_type === "active_symbols") {
        setMarkets((prev) => prev.concat(data?.active_symbols || []));
      }
      if (msg_type === "tick") {
        if (data.tick) {
          // Update current symbol ticks
          if (data.tick.symbol === symbol) {
            setTick((prev) => ({
              ...data.tick,
              asc: data.tick.quote >= prev?.quote,
            }));
          }
        }
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (symbol) {
      setLoading(true);
      sendJsonMessage({
        ticks: symbol,
        subscribe: 1,
      });
    }
  }, [symbol]);

  const handleChangeMarket = (event) => {
    setSymbol("");
    setTick(null);
    setError(null);
    // Find market by symbol
    setMarket(markets.find((m) => m.symbol === event.target.value));
    // Unsubscribe tick chanel
    // getWebSocket().close();
  };

  const handleChangeSymbol = (event) => {
    setSymbol(event.target.value);
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: ["Connecting", "info"],
    [ReadyState.OPEN]: ["Connected", "success"],
    [ReadyState.CLOSING]: ["Closing", "warning"],
    [ReadyState.CLOSED]: ["Closed", "error"],
    [ReadyState.UNINSTANTIATED]: ["Uninstantiated", "default"],
  }[readyState];

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
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        position="relative"
        square
      >
        {loading && (
          <LinearProgress
            color="error"
            sx={{ position: "fixed", width: "100%" }}
          />
        )}
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
          <Chip
            icon={<CircleIcon />}
            label={connectionStatus[0]}
            color={connectionStatus[1]}
            variant="outlined"
            sx={{ mt: 2 }}
          />
          <Box
            noValidate
            component="form"
            sx={{
              mt: 3,
              width: { xs: 300, md: 400 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              select
              fullWidth
              disabled={loading}
              margin="normal"
              label="Markets"
              id="markets"
              name="markets"
              value={market.symbol}
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
              {market && (
                <MenuItem value={market.symbol}>
                  {market?.display_name}
                </MenuItem>
              )}
            </TextField>
            <TextField
              focused
              fullWidth
              margin="normal"
              label="Current price of the symbol"
              name="current-price"
              id="current-price"
              value={priceFormat(tick?.quote || "0")}
              {...(tick && {
                color: tick.asc ? "success" : "error",
              })}
              InputProps={{
                readOnly: true,
              }}
            />
            <Alert
              severity="error"
              sx={{
                mt: 3,
                width: "100%",
                minHeight: 68,
                backgroundColor: "transparent",
                visibility: error ? "visible" : "hidden",
                color: (t) => t.palette.error.dark,
              }}
            >
              {error || ""}
            </Alert>
            <Footer />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
