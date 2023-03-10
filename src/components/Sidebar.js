import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import DiscountIcon from "@mui/icons-material/Discount";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AdjustIcon from "@mui/icons-material/AutoFixNormal";
import ProductIcon from "@mui/icons-material/Widgets";
import CategoryIcon from "@mui/icons-material/ManageSearch";
import SupplierIcon from "@mui/icons-material/Inventory";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
// import MyLocationIcon from "@mui/icons-material/MyLocation";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ReportIcon from "@mui/icons-material/Assessment";
import MoneyIcon from "@mui/icons-material/Paid";

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

const Sidebar = () => {
  // Rumah Sehat
  const [rsProductOpen, setRsProductOpen] = useState(false);
  const [rsDeliveryOpen, setRsDeliveryOpen] = useState(false);
  const [rsReportsOpen, setRsReportsOpen] = useState(false);

  // Dr's secret
  const [drIdOpen, setDrIdOpen] = useState(false);
  const [drSgOpen, setDrSgOpen] = useState(false);
  return (
    <List component="nav" sx={{ maxHeight: "calc(100vh - 65px)" }}>
      <SidebarLink to="/" text="Dasbhoard" icon={<DashboardIcon />} />
      <SidebarLink to="/customers" text="Customers" icon={<PeopleIcon />} />
      {/* <SidebarLink to="/regions" text="Regions" icon={<MyLocationIcon />} /> */}
      <Divider sx={{ my: 1 }} />
      <ListSubheader component="div" inset>
        Rumah Sehat
      </ListSubheader>
      <ListItemButton onClick={() => setRsProductOpen(!rsProductOpen)}>
        <ListItemIcon>
          <ProductIcon />
        </ListItemIcon>
        <ListItemText primary="Products" />
        {rsProductOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={rsProductOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <SidebarLink
            to="/rs/product-categories"
            text="Categories"
            icon={<CategoryIcon />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/rs/products"
            text="Products"
            icon={<ProductIcon />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/rs/suppliers"
            text="Suppliers"
            icon={<SupplierIcon />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/rs/purchases"
            text="Purchases"
            icon={<ShoppingCart />}
            sx={{ pl: 4 }}
          />
        </List>
      </Collapse>
      <ListItemButton onClick={() => setRsDeliveryOpen(!rsDeliveryOpen)}>
        <ListItemIcon>
          <LocalShipping />
        </ListItemIcon>
        <ListItemText primary="Deliveries" />
        {rsDeliveryOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={rsDeliveryOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <SidebarLink
            to="/rs/delivery-types"
            text="Delivery Type"
            icon={<CategoryIcon />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/rs/deliveries"
            text="Deliveries"
            icon={<LocalShipping />}
            sx={{ pl: 4 }}
          />
        </List>
      </Collapse>

      <SidebarLink to="/rs/invoices" text="Invoices" icon={<ReceiptIcon />} />

      <ListItemButton onClick={() => setRsReportsOpen(!rsReportsOpen)}>
        <ListItemIcon>
          <ReportIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
        {rsReportsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={rsReportsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <SidebarLink
            to="/rs/reports/supplier-invoice"
            text="Supplier Invoice"
            sx={{ pl: 4 }}
            icon={<ReceiptLongIcon />}
          />
          <SidebarLink
            to="/rs/reports/profits"
            text="Profits"
            icon={<MoneyIcon />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/rs/reports/products"
            text="Products"
            icon={<ProductIcon />}
            sx={{ pl: 4 }}
          />
        </List>
      </Collapse>

      <SidebarLink
        to="/rs/adjustments"
        text="Adjustments"
        icon={<AdjustIcon />}
      />

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
            to="/dr/id/items"
            text="Items"
            icon={<SanitizerIcon />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/dr/id/deliveries"
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
            to="/dr/sg/items"
            text="Items"
            icon={<SanitizerIcon />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/dr/sg/deliveries"
            text="Delivery"
            icon={<LocalShipping />}
            sx={{ pl: 4 }}
          />
        </List>
      </Collapse>
      <SidebarLink to="/dr/invoices" text="Invoices" icon={<ReceiptIcon />} />
      <SidebarLink
        to="/dr/discount-models"
        text="Discount Models"
        icon={<DiscountIcon />}
      />
    </List>
  );
};

export default Sidebar;
