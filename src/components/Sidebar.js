import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SanitizerIcon from "@mui/icons-material/Sanitizer";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Collapse, Divider, List } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LocalShipping from "@mui/icons-material/LocalShipping";
import LocalHospital from "@mui/icons-material/LocalHospital";

const SidebarLink = ({ to, text, icon, ...rest }) => {
  return (
    <ListItemButton component={RouterLink} to={to} underline={"none"} {...rest}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
};

export const mainListItems = (
  <React.Fragment>
    <SidebarLink to="/" text="Dasbhoard" icon={<DashboardIcon />} />
    <SidebarLink to="/customers" text="Customers" icon={<PeopleIcon />} />
  </React.Fragment>
);

const Sidebar = () => {
  const [drIdOpen, setDrIdOpen] = useState(false);
  const [drSgOpen, setDrSgOpen] = useState(false);
  return (
    <List component="nav">
      {mainListItems}
      <Divider sx={{ my: 1 }} />
      <ListSubheader component="div" inset>
        Dr's Secret
      </ListSubheader>
      <ListItemButton onClick={() => setDrIdOpen(!drIdOpen)}>
        <ListItemIcon>
          <LocalHospital />
        </ListItemIcon>
        <ListItemText primary="Indonesia" />
        {drIdOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={drIdOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <SidebarLink
            to="/"
            text="Items"
            icon={<SanitizerIcon />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/"
            text="Delivery"
            icon={<LocalShipping />}
            sx={{ pl: 4 }}
          />
        </List>
      </Collapse>
      <ListItemButton onClick={() => setDrSgOpen(!drSgOpen)}>
        <ListItemIcon>
          <LocalHospital />
        </ListItemIcon>
        <ListItemText primary="Singapore" />
        {drSgOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={drSgOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <SidebarLink
            to="/"
            text="Items"
            icon={<SanitizerIcon />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/"
            text="Delivery"
            icon={<LocalShipping />}
            sx={{ pl: 4 }}
          />
        </List>
      </Collapse>
    </List>
  );
};

export default Sidebar;
