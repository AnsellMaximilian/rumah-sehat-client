import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import SmartTable from "../../../components/SmartTable";
import http from "../../../http-common";
import NumericFormatRp from "../../../components/NumericFormatRp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { copyTextToClipboard } from "../../../helpers/common";

export default function OutstandingCustomers() {
  const [outstandingCustomers, setOutstandingCustomers] = useState([]);

  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 100 },
      { field: "name", headerName: "Customer", width: 250 },
      { field: "count", headerName: "Count", width: 75 },
      {
        field: "invoiceNumbers",
        headerName: "Invoice Nunmbers",
        width: 250,
        renderCell: (params) =>
          params.row.invoiceNumbers.map((inv) => `#${inv}`).join(", "),
      },
      {
        field: "total",
        headerName: "Total (Rp)",
        width: 100,
        renderCell: (params) => <NumericFormatRp value={params.row.total} />,
      },

      {
        field: "actions",
        headerName: "Actions",
        renderCell: (params) => {
          return (
            <>
              <IconButton
                color="warning"
                onClick={(e) => {
                  e.stopPropagation();
                  copyTextToClipboard(
                    `*REMINDER*\nMohon bantuannya untuk dapat menyelesaikan pembayaran atas invoice ${params.row.invoiceNumbers
                      .map((inv) => `#${inv}`)
                      .join(
                        ", "
                      )}.\nJika sudah boleh konfirmasi ya.\n\nTerima kasih 🙏\n_Rumah Sehat_`
                  );
                }}
              >
                <NotificationsIcon />
              </IconButton>
            </>
          );
        },
        width: 200,
      },
    ],
    []
  );

  useEffect(() => {
    (async () => {
      const unpaidInvoices = (await http.get("/rs/invoices?status=pending"))
        .data.data;

      setOutstandingCustomers(
        unpaidInvoices.reduce((arr, inv) => {
          let updatedArr = [...arr];
          const existingCustomer = updatedArr.find(
            (cus) => cus.id === inv.CustomerId
          );

          if (existingCustomer) {
            updatedArr = updatedArr.map((cus) => {
              if (cus.id === inv.CustomerId) {
                const newData = { ...existingCustomer };
                newData.count++;
                newData.total += inv.totalPrice;
                newData.invoiceNumbers = [...newData.invoiceNumbers, inv.id];
                return newData;
              }
              return cus;
            });
          } else {
            updatedArr.push({
              id: inv.CustomerId,
              name: inv.Customer.fullName,
              count: 1,
              total: inv.totalPrice,
              invoiceNumbers: [inv.id],
            });
          }

          return updatedArr;
        }, [])
      );
    })();
  }, []);

  console.log(outstandingCustomers);
  return (
    <Box>
      <SmartTable
        rows={outstandingCustomers.map((cus) => ({
          id: cus.id,
          name: cus.name,
          count: cus.count,
          total: cus.total,
          invoiceNumbers: cus.invoiceNumbers,
        }))}
        columns={columns}
      />
    </Box>
  );
}
