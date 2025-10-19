import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import http from "../../../http-common";
import { toast } from "react-toastify";
import NumericFormatRp from "../../../components/NumericFormatRp";

export default function CollectionCreate() {
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [paidStatus, setPaidStatus] = useState("all"); // all | paid | unpaid
  const [sortOrder, setSortOrder] = useState("desc"); // asc | desc

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setCustomers((await http.get("/customers")).data.data);
    })();
  }, []);

  const fetchInvoices = async () => {
    if (!selectedCustomer) return toast.info("Select customer first.");
    setLoadingInvoices(true);
    try {
      const paidQP =
        paidStatus === "paid"
          ? "&paid=true"
          : paidStatus === "unpaid"
          ? "&unpaid=true"
          : "";
      const res = await http.get(
        `/dr/invoices?CustomerId=${selectedCustomer.id}${paidQP}`
      );
      const data = res.data.data;
      const sorted = [...data].sort((a, b) =>
        sortOrder === "asc" ? a.id - b.id : b.id - a.id
      );
      setInvoices(sorted);
    } catch (error) {
      toast.error("Failed to fetch invoices.");
    } finally {
      setLoadingInvoices(false);
    }
  };

  useEffect(() => {
    // Re-sort locally when sort order changes
    setInvoices((prev) =>
      [...prev].sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id))
    );
  }, [sortOrder]);

  const toggleInvoice = (id) => {
    setSelectedInvoiceIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const subtotalSelected = useMemo(() => {
    return invoices
      .filter((i) => selectedInvoiceIds.includes(i.id))
      .reduce((sum, inv) => sum + (inv.totalPriceRP || 0), 0);
  }, [invoices, selectedInvoiceIds]);

  const handleCreate = async () => {
    try {
      if (!date) throw new Error("Date is required.");
      const created = (
        await http.post("/dr/invoice-collections", { date, note })
      ).data.data;

      if (selectedInvoiceIds.length > 0) {
        await http.patch(`/dr/invoice-collections/${created.id}`, {
          invoiceIds: selectedInvoiceIds,
        });
      }
      toast.success("Collection created.");
      navigate(`/dr/invoices/collections/${created.id}`);
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  return (
    <Box display="grid" gap={2}>
      <Card sx={{ padding: 2 }}>
        <Typography variant="h6">Create Collection</Typography>
        <Box display="flex" gap={2} marginTop={2}>
          <TextField
            size="small"
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            label="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            sx={{ minWidth: 360 }}
          />
        </Box>
      </Card>
      <Card sx={{ padding: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Add Invoices</Typography>
          <Typography variant="body2" color="text.secondary">
            Subtotal Selected: <NumericFormatRp value={subtotalSelected} />
          </Typography>
        </Stack>
        <Box display="flex" gap={2} marginTop={2} alignItems="center">
          <Autocomplete
            size="small"
            value={selectedCustomer}
            onChange={(e, nv) => setSelectedCustomer(nv)}
            getOptionLabel={(o) => `(#${o.id}) ${o.fullName}`}
            options={customers}
            sx={{ width: 340 }}
            renderInput={(params) => <TextField {...params} label="Customer" />}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="paid-status-label">Paid Status</InputLabel>
            <Select
              labelId="paid-status-label"
              label="Paid Status"
              value={paidStatus}
              onChange={(e) => setPaidStatus(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="unpaid">Unpaid</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="sort-order-label">Sort by Invoice ID</InputLabel>
            <Select
              labelId="sort-order-label"
              label="Sort by Invoice ID"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <MenuItem value="desc">Descending</MenuItem>
              <MenuItem value="asc">Ascending</MenuItem>
            </Select>
          </FormControl>
          <Button onClick={fetchInvoices} disabled={!selectedCustomer || loadingInvoices}>
            {loadingInvoices ? "Loading..." : "Fetch Invoices"}
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box display="grid" gap={1}>
          {invoices.map((inv) => (
            <Box
              key={inv.id}
              display="grid"
              gridTemplateColumns="24px 1fr 160px 160px"
              alignItems="center"
              gap={2}
            >
              <Checkbox
                checked={selectedInvoiceIds.includes(inv.id)}
                onChange={() => toggleInvoice(inv.id)}
              />
              <Box display="flex" gap={2} alignItems="center">
                <Typography>
                  #{inv.id} — {inv.date}
                </Typography>
                {inv.DrInvoiceCollectionId && (
                  <Typography fontSize={11} color="warning.main">
                    already in collection #{inv.DrInvoiceCollectionId}
                  </Typography>
                )}
              </Box>
              <Typography>
                {inv.Customer ? inv.Customer.fullName : inv.customerFullName}
              </Typography>
              <Typography>
                <NumericFormatRp value={inv.totalPriceRP || 0} />
              </Typography>
            </Box>
          ))}
          {invoices.length === 0 && (
            <Typography color="text.secondary">No invoices loaded.</Typography>
          )}
        </Box>
      </Card>

      <Box display="flex" gap={2}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleCreate}>
          Create
        </Button>
      </Box>
    </Box>
  );
}
