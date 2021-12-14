import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const Header = () => (
  <AppBar position="fixed">
    <Toolbar>
      {" "}
      <Typography variant="h5" noWrap>
        CO2 Checker
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
