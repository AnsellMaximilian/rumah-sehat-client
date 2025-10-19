import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import http from "../../../http-common";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { formQueryParams, getWeek } from "../../../helpers/common";

export default function CollectionIndex() {
  const [collections, setCollections] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Initialize from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("startDate") || "";
    const e = params.get("endDate") || "";
    const customerId = params.get("CustomerId");
    setStartDate(s);
    setEndDate(e);
    (async () => {
      const fetchedCustomers = (await http.get("/customers")).data.data;
      setCustomers(fetchedCustomers);
      if (customerId) {
        const found = fetchedCustomers.find((c) => String(c.id) === customerId);
        if (found) setSelectedCustomer(found);
      }
    })();
  }, []);

  const handleSetWeek = () => {
    const { weekStart, weekEnd } = getWeek();
    setStartDate(weekStart);
    setEndDate(weekEnd);
  };

  const handleClear = async () => {
    setSelectedCustomer(null);
    setStartDate("");
    setEndDate("");
    await fetchCollections({});
    navigate(".");
  };

  const fetchCollections = async ({ CustomerId, startDate, endDate }) => {
    const qp = formQueryParams({ CustomerId, startDate, endDate });
    const data = (await http.get(`/dr/invoice-collections${qp ? `?${qp}` : ""}`))
      .data.data;
    setCollections(data);
  };

  const handleFilter = async () => {
    const qp = formQueryParams({
      CustomerId: selectedCustomer ? selectedCustomer.id : undefined,
      startDate,
      endDate,
    });
    await fetchCollections({
      CustomerId: selectedCustomer ? selectedCustomer.id : undefined,
      startDate,
      endDate,
    });
    navigate({ search: `?${qp}` });
  };

  useEffect(() => {
    (async () => {
      await fetchCollections({
        CustomerId: selectedCustomer ? selectedCustomer.id : undefined,
        startDate,
        endDate,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers.length]);

  const rows = useMemo(() => {
    return collections.map((c) => {
      const totalInvoicesRP = c.totalInvoicesRP || 0;
      const totalAdjustmentsRP = c.totalAdjustmentsRP || 0;
      const grandTotalRP = c.grandTotalRP || 0;
      return (
        <Card key={c.id} sx={{ padding: 2, display: "grid", gap: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={18} fontWeight="bold">
              Collection #{c.id}
            </Typography>
            <Box display="flex" gap={1}>
              <Button component={Link} to={`./${c.id}`} variant="outlined">
                Open
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  const url = `${http.defaults.baseURL}/dr/invoice-collections/${c.id}/print`;
                  window.open(url, "_blank");
                }}
              >
                Print
              </Button>
            </Box>
          </Box>
          <Divider />
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
            <Box>
              <Typography variant="caption">Date</Typography>
              <Typography>{c.date}</Typography>
            </Box>
            <Box>
              <Typography variant="caption">Invoices</Typography>
              <Typography>
                {c.DrInvoices ? c.DrInvoices.length : 0} invoice(s)
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption">Adjustments</Typography>
              <Typography>
                {c.DrInvoiceCollectionAdjustments
                  ? c.DrInvoiceCollectionAdjustments.length
                  : 0} adjustments
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
            <Box>
              <Typography variant="caption">Total Invoices</Typography>
              <Typography>
                <NumericFormatRp value={totalInvoicesRP} />
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption">Total Adjustments</Typography>
              <Typography>
                <NumericFormatRp value={totalAdjustmentsRP} />
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption">Grand Total</Typography>
              <Typography>
                <NumericFormatRp value={grandTotalRP} />
              </Typography>
            </Box>
          </Box>
        </Card>
      );
    });
  }, [collections]);

  return (
    <Box>
      <Box marginBottom={2}>
        <Button component={Link} to="./create" variant="contained">
          Create Collection
        </Button>
      </Box>
      <Box display="flex" gap={2} alignItems="center" marginBottom={2}>
        <Autocomplete
          size="small"
          value={selectedCustomer}
          onChange={(e, nv) => setSelectedCustomer(nv)}
          getOptionLabel={(o) => `(#${o.id}) ${o.fullName}`}
          options={customers}
          sx={{ width: 340 }}
          renderInput={(params) => <TextField {...params} label="Customer" />}
        />
        <TextField
          size="small"
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          size="small"
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="outlined" onClick={handleSetWeek}>
          This Week
        </Button>
        <Button variant="contained" onClick={handleFilter}>
          Filter
        </Button>
        <Button onClick={handleClear}>Clear</Button>
      </Box>
      <Box display="grid" gap={2}>
        {rows}
        {rows.length === 0 && (
          <Typography color="text.secondary">No collections.</Typography>
        )}
      </Box>
    </Box>
  );
}

