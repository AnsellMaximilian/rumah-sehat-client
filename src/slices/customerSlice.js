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

export const destroyCustomer = createAsyncThunk(
  "customers/destroy",
  async (id) => {
    const res = await http.delete(`/customers/${id}`);
    return await res.data.data;
  }
);

export const fetchCustomer = createAsyncThunk("customers/show", async (id) => {
  const res = await http.get(`/customers/${id}`);
  return await res.data.data;
});

export const updateCustomer = createAsyncThunk(
  "customers/update",
  async (updateData) => {
    const { id, fullName, phone, address } = updateData;

    const res = await http.patch(`/customers/${id}`, {
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
    builder.addCase(destroyCustomer.fulfilled, (state, action) => {
      state.customers = state.customers.filter(
        (customer) => customer.id !== action.payload.id
      );
    });
  },
});

export const { increment, decrement, incrementByAmount } =
  customerSlice.actions;

export default customerSlice.reducer;
