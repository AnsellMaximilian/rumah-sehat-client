import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import DiscountIcon from "@mui/icons-material/Discount";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import StockIcon from "@mui/icons-material/AssignmentTurnedIn";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
// import AdjustIcon from "@mui/icons-material/AutoFixNormal";
import ProductIcon from "@mui/icons-material/Widgets";
import ExpenseIcon from "@mui/icons-material/AttachMoney";
import CategoryIcon from "@mui/icons-material/ManageSearch";
import SupplierIcon from "@mui/icons-material/Inventory";
import SyncIcon from "@mui/icons-material/Sync";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
// import MyLocationIcon from "@mui/icons-material/MyLocation";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ReportIcon from "@mui/icons-material/Assessment";
import MoneyIcon from "@mui/icons-material/Paid";
import PanToolAltIcon from "@mui/icons-material/PanToolAlt";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import SanitizerIcon from "@mui/icons-material/Sanitizer";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Collapse, Divider, List } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LocalShipping from "@mui/icons-material/LocalShipping";
// import LocalHospital from "@mui/icons-material/LocalHospital";

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
  const [drReportsOpen, setDrReportsOpen] = useState(false);
  const [expensesOpen, setExpensesOpen] = useState(false);

  // Dr's secret
  const [drItemsOpen, setDrItemsOpen] = useState(false);
  const [drDeliveriesOpen, setDrDeliveriesOpen] = useState(false);
  return (
    <List component="nav" sx={{ maxHeight: "calc(100vh - 65px)" }}>
      <SidebarLink to="/" text="Dasbhoard" icon={<DashboardIcon />} />
      <SidebarLink to="/customers" text="Customers" icon={<PeopleIcon />} />
      {/* <SidebarLink
        to="/transactions"
        text="Transactions"
        icon={<CurrencyExchangeIcon />}
      /> */}
      {/* <ListItemButton onClick={() => setExpensesOpen(!expensesOpen)}>
        <ListItemIcon>
          <ExpenseIcon />
        </ListItemIcon>
        <ListItemText primary="Expenses" />
        {expensesOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={expensesOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <SidebarLink
            to="/expenses"
            text="Expenses"
            icon={<ExpenseIcon />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/expenditures"
            text="Expenditures"
            icon={<ReceiptLongIcon />}
            sx={{ pl: 4 }}
          />
        </List>
      </Collapse> */}
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
          <SidebarLink
            to="/rs/purchase-invoices"
            text="Purchase Invoices"
            icon={<ReceiptIcon />}
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
            to="/rs/reports/full-report"
            text="Full Report"
            sx={{ pl: 4 }}
            icon={<ReportIcon />}
          />
          <SidebarLink
            to="/rs/reports/financial-report"
            text="Financial Report"
            sx={{ pl: 4 }}
            icon={<RequestQuoteIcon />}
          />
          <SidebarLink
            to="/rs/reports/outstanding-customers"
            text="Outstanding Customers"
            sx={{ pl: 4 }}
            icon={<ReportProblemIcon />}
          />
          {/* <SidebarLink
            to="/rs/reports/profits"
            text="Profits"
            icon={<MoneyIcon />}
            sx={{ pl: 4 }}
          /> */}
          <SidebarLink
            to="/rs/reports/detailed-profits"
            text="Detailed Profits"
            icon={<MoneyIcon />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/rs/reports/products"
            text="Products"
            icon={<ProductIcon />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/rs/reports/stock"
            text="Stock Report"
            sx={{ pl: 4 }}
            icon={<StockIcon />}
          />
          <SidebarLink
            to="/rs/reports/compare"
            text="Compare"
            icon={<CompareArrowsIcon />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/rs/reports/analytics"
            text="Analytics"
            icon={<AnalyticsIcon />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/rs/reports/actions"
            text="Actions"
            icon={<PanToolAltIcon />}
            sx={{ pl: 4 }}
          />
        </List>
      </Collapse>

      {/* <SidebarLink
        to="/rs/adjustments"
        text="Adjustments"
        icon={<AdjustIcon />}
      /> */}

      <Divider sx={{ my: 1 }} />
      <ListSubheader component="div" inset>
        Dr's Secret
      </ListSubheader>
      <ListItemButton onClick={() => setDrItemsOpen(!drItemsOpen)}>
        <ListItemIcon>
          <SanitizerIcon />
        </ListItemIcon>
        <ListItemText primary="Items" />
        {drItemsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={drItemsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <SidebarLink
            to="/dr/id/items"
            text="Indonesia"
            icon={<SanitizerIcon />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/dr/sg/items"
            text="Singapore"
            icon={<SanitizerIcon />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/dr/my/items"
            text="Malaysia"
            icon={<SanitizerIcon />}
            sx={{ pl: 4 }}
          />
        </List>
      </Collapse>
      <SidebarLink to="/dr/loans" text="Loans" icon={<SyncIcon />} />

      <ListItemButton onClick={() => setDrDeliveriesOpen(!drDeliveriesOpen)}>
        <ListItemIcon>
          <LocalShipping />
        </ListItemIcon>
        <ListItemText primary="Deliveries" />
        {drDeliveriesOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={drDeliveriesOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <SidebarLink
            to="/dr/id/deliveries"
            text="Indonesia"
            icon={<LocalShipping />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/dr/sg/deliveries"
            text="Singapore"
            icon={<LocalShipping />}
            sx={{ pl: 4 }}
          />
          <SidebarLink
            to="/dr/my/deliveries"
            text="Malaysia"
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
      <ListItemButton onClick={() => setDrReportsOpen(!drReportsOpen)}>
        <ListItemIcon>
          <ReportIcon />
        </ListItemIcon>
        <ListItemText primary="Reports" />
        {drReportsOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={drReportsOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <SidebarLink
            to="/dr/reports/stock/id"
            text="Stock Report ID"
            sx={{ pl: 4 }}
            icon={<StockIcon />}
          />
          <SidebarLink
            to="/dr/reports/stock/sg"
            text="Stock Report SG"
            sx={{ pl: 4 }}
            icon={<StockIcon />}
          />
        </List>
      </Collapse>
    </List>
  );
};

export default Sidebar;
