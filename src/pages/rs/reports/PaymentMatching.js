import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PayIcon from "@mui/icons-material/Paid";
import ShowIcon from "@mui/icons-material/RemoveRedEye";
import { Link, useLocation, useNavigate } from "react-router-dom";
import http from "../../../http-common";
import SmartTable from "../../../components/SmartTable";
import NumericFormatRp from "../../../components/NumericFormatRp";
import { toast } from "react-toastify";

function parseCSVContent(text) {
  // Normalize line endings and remove BOM
  text = text.replace(/\ufeff/g, "");

  // Split into lines, trim, and remove empties
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Find the first header line that looks like CSV columns
  const headerIdx = lines.findIndex(
    (l) =>
      l.toLowerCase().includes("tanggal") &&
      l.toLowerCase().includes("keterangan")
  );

  if (headerIdx === -1) {
    console.warn("No valid header found in CSV");
    return [];
  }

  // Everything after the header line is data until “Saldo Awal” or summary lines
  const dataLines = lines
    .slice(headerIdx + 1)
    .filter(
      (l) => !/^saldo/i.test(l) && !/^kredit/i.test(l) && !/^debet/i.test(l)
    );

  const entries = [];
  for (const raw of dataLines) {
    const line = raw.startsWith("'") ? raw.slice(1) : raw;
    const parts = line.split(",");
    if (parts.length < 6) continue;

    const tanggal = parts[0];
    const keterangan = parts[1];
    const jumlahStr = parts[3]; // <-- fixed index
    const type = (parts[4] || "").trim().toUpperCase(); // <-- fixed index

    if (!/^(CR|DB)$/.test(type)) continue;

    const amount = parseFloat(jumlahStr.replace(/[^0-9.]/g, ""));
    if (isNaN(amount)) continue;

    let nameCandidate = "";
    const upperMatch = keterangan.match(/([A-Z][A-Z\s.'-]{2,})\s*$/);
    if (upperMatch) {
      nameCandidate = upperMatch[1].trim();
    } else {
      const tokens = keterangan.split(/\s{2,}/);
      nameCandidate = tokens[tokens.length - 1].trim();
    }

    entries.push({
      date: tanggal,
      description: keterangan,
      amount,
      type,
      name: nameCandidate,
    });
  }

  return entries;
}

function buildMatch(invoice, txs, margin) {
  const result = { name: false, amount: false, exact: false };
  if (!invoice) return result;
  const invTotal = invoice.totalPrice || 0;
  const accountName = (invoice.Customer?.accountName || "")
    .trim()
    .toUpperCase();
  if (txs.length === 0) return result;

  // Evaluate best tx
  let best = null;
  for (const tx of txs) {
    const isName = accountName && tx.name?.toUpperCase().includes(accountName);
    const diff = Math.abs((tx.amount || 0) - invTotal);
    const isExact = diff === 0;
    const isAmount = diff <= margin;
    const score = (isName ? 2 : 0) + (isExact ? 2 : isAmount ? 1 : 0);
    if (
      !best ||
      score > best.score ||
      (score === best.score && diff < best.diff)
    ) {
      best = { isName, isAmount, isExact, diff, tx, score };
    }
  }
  if (!best) return result;
  return { name: best.isName, amount: best.isAmount, exact: best.isExact };
}

export default function PaymentMatching() {
  const [invoices, setInvoices] = useState([]);
  const [csvTxs, setCsvTxs] = useState([]);
  const [margin, setMargin] = useState(5000);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const data = (await http.get("/rs/invoices?status=pending")).data.data;
      setInvoices(data);
    })();
  }, []);

  // URL persistence for margin and maybe file cannot persist. Use margin only.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const m = params.get("margin");
    if (m) setMargin(parseInt(m, 10));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("margin", String(margin));
    navigate({ search: params.toString() }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [margin]);

  const columns = [
    {
      headerName: "ID",
      field: "id",
      width: 100,
      renderCell: (params) => (
        <Button
          component={Link}
          to={`/rs/invoices/${params.row.id}`}
          size="small"
        >
          #{params.row.id}
        </Button>
      ),
    },
    {
      headerName: "Date",
      field: "date",
      width: 120,
      valueGetter: (params) => params.row.date,
    },
    {
      headerName: "Customer",
      field: "customerFullName",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => params.row.customerFullName,
    },
    {
      headerName: "Account Name",
      field: "accountName",
      width: 220,
      valueGetter: (params) => params.row.Customer?.accountName || "",
    },
    {
      headerName: "Total",
      field: "totalPrice",
      width: 150,
      renderCell: (params) => <NumericFormatRp value={params.row.totalPrice} />,
    },
    {
      headerName: "Match",
      field: "match",
      width: 220,
      renderCell: (params) => {
        const m = buildMatch(params.row, csvTxs, margin);
        const chips = [];

        if (m.name)
          chips.push(
            <Chip key="name" label="NAME" color="warning" size="small" />
          );
        if (m.exact)
          chips.push(
            <Chip key="exact" label="EXACT" color="success" size="small" />
          );
        else if (m.amount)
          chips.push(
            <Chip key="amount" label="AMOUNT" color="warning" size="small" />
          );
        if (chips.length === 0)
          chips.push(<Chip key="none" label="NONE" size="small" />);
        // If both matched (name + (exact/amount)) → color overall green by wrapping background? Keep chips with success when exact.

        return (
          <Stack direction="row" spacing={0.5}>
            {chips}
          </Stack>
        );
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton
            color="success"
            title="Mark Paid"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                // pending -> paid in one cycle
                const inv = (
                  await http.patch(`/rs/invoices/${params.row.id}/cycle-status`)
                ).data.data;
                toast.success(`Invoice #${inv.id} set to ${inv.status}`);
                setInvoices((prev) =>
                  prev.filter((i) => i.id !== params.row.id)
                );
              } catch (err) {
                toast.error("Failed to update status");
              }
            }}
          >
            <PayIcon />
          </IconButton>
          <IconButton component={Link} to={`/rs/invoices/${params.row.id}`}>
            <ShowIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const handleCSVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();

      const txs = parseCSVContent(text);
      setCsvTxs(txs);
      toast.success(`Loaded ${txs.length} transactions`);
    } catch (error) {
      toast.error("Failed to parse CSV");
    }
  };

  return (
    <Box>
      <Card sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h6">Payment Matching</Typography>
        <Grid container spacing={2} alignItems="center" marginTop={1}>
          <Grid item>
            <Button
              component="label"
              startIcon={<UploadFileIcon />}
              variant="outlined"
            >
              Import CSV
              <input
                hidden
                accept=".csv,text/csv,text/plain"
                type="file"
                onChange={handleCSVUpload}
              />
            </Button>
          </Grid>
          <Grid item>
            <TextField
              size="small"
              type="number"
              label="Acceptable Margin (Rp)"
              value={margin}
              onChange={(e) => setMargin(parseInt(e.target.value || "0", 10))}
              sx={{ width: 220 }}
              helperText="Default 5000. Exact match shows EXACT."
            />
          </Grid>
        </Grid>
        <Divider sx={{ marginTop: 2 }} />
        <Box marginTop={1}>
          <Typography variant="body2" color="text.secondary">
            Only credit (CR) rows are considered from the CSV. Names are
            extracted heuristically from Keterangan.
          </Typography>
        </Box>
      </Card>

      <SmartTable rows={invoices} columns={columns} />
    </Box>
  );
}
