import React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary">
      {`Copyright © ${new Date().getFullYear()}`}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 5,
        // backgroundColor: (theme) => theme.palette.grey[50],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1">
          Made with ❤️ by{" "}
          <Link
            color="inherit"
            href="https://github.com/dadwic"
            target="_blank"
          >
            @dadwic
          </Link>
        </Typography>
        <Copyright />
      </Container>
    </Box>
  );
}
