import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../../http-common";
import { toast } from "react-toastify";
import NumericFormatRp from "../../../components/NumericFormatRp";

export default function CollectionShow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [collection, setCollection] = useState(null);
  const [adjDescription, setAdjDescription] = useState("");
  const [adjAmount, setAdjAmount] = useState(0);
  const [adjDate, setAdjDate] = useState("");

  // Manage invoices states
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [paidStatus, setPaidStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchCollection = async () => {
    const data = (await http.get(`/dr/invoice-collections/${id}`)).data.data;
    setCollection(data);
  };

  useEffect(() => {
    fetchCollection();
    (async () => {
      setCustomers((await http.get("/customers")).data.data);
    })();
  }, [id]);

  const handleAddAdjustment = async () => {
    try {
      if (!adjDescription || !adjDate) throw new Error("Fill all fields.");
      await http.post(`/dr/invoice-collections/${id}/adjustments`, {
        description: adjDescription,
        amount: parseInt(adjAmount, 10),
        date: adjDate,
      });
      toast.success("Adjustment added.");
      setAdjDescription("");
      setAdjAmount(0);
      setAdjDate("");
      await fetchCollection();
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  const handleDeleteAdjustment = async (adjId) => {
    try {
      await http.delete(`/dr/invoice-collections/adjustments/${adjId}`);
      toast.success("Adjustment removed.");
      await fetchCollection();
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

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
    // Sync selected IDs from collection once loaded
    if (collection) {
      setSelectedInvoiceIds(collection.DrInvoices.map((i) => i.id));
    }
  }, [collection]);

  useEffect(() => {
    // Resort invoices when order changes
    setInvoices((prev) =>
      [...prev].sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id))
    );
  }, [sortOrder]);

  const toggleInvoice = (id) => {
    setSelectedInvoiceIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSaveInvoices = async () => {
    try {
      await http.patch(`/dr/invoice-collections/${id}`, {
        invoiceIds: selectedInvoiceIds,
      });
      toast.success("Collection invoices updated.");
      await fetchCollection();
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  const handleDeleteCollection = async () => {
    if (!window.confirm("Delete this collection? Invoices will be preserved."))
      return;
    try {
      await http.delete(`/dr/invoice-collections/${id}`);
      toast.success("Collection deleted.");
      navigate("/dr/invoices/collections");
    } catch (error) {
      const errorValue = error?.response?.data?.error;
      const errorMsg = errorValue ? errorValue : error.message;
      toast.error(errorMsg);
    }
  };

  const totals = useMemo(() => {
    if (!collection) return { invoices: 0, adjustments: 0, grand: 0 };
    return {
      invoices: collection.totalInvoicesRP || 0,
      adjustments: collection.totalAdjustmentsRP || 0,
      grand: collection.grandTotalRP || 0,
    };
  }, [collection]);

  return collection ? (
    <Box display="grid" gap={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontSize={24} fontWeight="bold">
          Collection #{collection.id}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            const url = `${http.defaults.baseURL}/dr/invoice-collections/${collection.id}/print`;
            window.open(url, "_blank");
          }}
        >
          Print
        </Button>
      </Stack>
      <Box>
        <Button color="error" onClick={handleDeleteCollection}>
          Delete Collection
        </Button>
      </Box>
      <Card sx={{ padding: 2 }}>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
          <Box>
            <Typography variant="caption">Date</Typography>
            <Typography>{collection.date}</Typography>
          </Box>
          <Box>
            <Typography variant="caption">Invoices</Typography>
            <Typography>{collection.DrInvoices.length}</Typography>
          </Box>
          <Box>
            <Typography variant="caption">Adjustments</Typography>
            <Typography>
              {collection.DrInvoiceCollectionAdjustments.length}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
          <Box>
            <Typography variant="caption">Total Invoices</Typography>
            <NumericFormatRp value={totals.invoices} />
          </Box>
          <Box>
            <Typography variant="caption">Total Adjustments</Typography>
            <NumericFormatRp value={totals.adjustments} />
          </Box>
          <Box>
            <Typography variant="caption">Grand Total</Typography>
            <NumericFormatRp value={totals.grand} />
          </Box>
        </Box>
      </Card>

      <Card sx={{ padding: 2 }}>
        <Typography variant="h6">Invoices</Typography>
        <TableContainer sx={{ marginTop: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Invoice</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell align="right">Total (Rp)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {collection.DrInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>#{inv.id}</TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell>
                    {inv.Customer ? inv.Customer.fullName : inv.customerFullName}
                  </TableCell>
                  <TableCell align="right">
                    <NumericFormatRp value={inv.totalPriceRP || 0} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card sx={{ padding: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Manage Invoices</Typography>
          <Button variant="contained" onClick={handleSaveInvoices}>
            Save
          </Button>
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
                {inv.DrInvoiceCollectionId && inv.DrInvoiceCollectionId !== collection.id && (
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

      <Card sx={{ padding: 2 }}>
        <Typography variant="h6">Adjustments</Typography>
        <Box display="flex" gap={2} marginTop={2}>
          <TextField
            size="small"
            label="Date"
            type="date"
            value={adjDate}
            onChange={(e) => setAdjDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            size="small"
            label="Description"
            value={adjDescription}
            onChange={(e) => setAdjDescription(e.target.value)}
            sx={{ minWidth: 360 }}
          />
          <TextField
            size="small"
            label="Amount (Rp)"
            type="number"
            value={adjAmount}
            onChange={(e) => setAdjAmount(e.target.value)}
            sx={{ width: 200 }}
          />
          <Button variant="contained" onClick={handleAddAdjustment}>
            Add
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount (Rp)</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {collection.DrInvoiceCollectionAdjustments.map((adj) => (
                <TableRow key={adj.id}>
                  <TableCell>{adj.date}</TableCell>
                  <TableCell>{adj.description}</TableCell>
                  <TableCell align="right">
                    <NumericFormatRp value={adj.amount} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleDeleteAdjustment(adj.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {collection.DrInvoiceCollectionAdjustments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography color="text.secondary">
                      No adjustments.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  ) : (
    <Typography>Loading...</Typography>
  );
}
