import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../http-common";

const initialState = {
  customers: [],
};

export const fetchCustomers = createAsyncThunk("customers/index", async () => {
  const res = await http.get("/customers");
  return await res.data.data;
});

export const storeCustomer = createAsyncThunk(
  "customers/store",
  async ({ fullName, phone, address }) => {
    const res = await http.post("/customers", {
      fullName,
      phone,
      address,
    });
    return await res.data.data;
  }
);

export const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.customers = action.payload;
    });
    builder.addCase(storeCustomer.fulfilled, (state, action) => {
      state.customers.push(action.payload);
    });
  },
});

export const { increment, decrement, incrementByAmount } =
  customerSlice.actions;

export default customerSlice.reducer;
