import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import http from "../http-common";

const initialState = {
  customers: [],
  error: null,
};

export const fetchCustomers = createAsyncThunk("customers/index", async () => {
  const res = await http.get("/customers");
  return await res.data;
});

export const storeCustomer = createAsyncThunk(
  "customers/store",
  async ({ fullName, phone, address }) => {
    const res = await http.post("/customers", {
      fullName,
      phone,
      address,
    });
    return await res.data;
  }
);

export const destroyCustomer = createAsyncThunk(
  "customers/destroy",
  async (id) => {
    const res = await http.delete(`/customers/${id}`);
    return await res.data;
  }
);

export const fetchCustomer = createAsyncThunk("customers/show", async (id) => {
  const res = await http.get(`/customers/${id}`);
  return await res.data;
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
    return await res.data;
  }
);

export const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      const { data, error } = action.payload;
      if (!error) {
        state.customers = data;
      } else {
        state.error = error.name;
      }
    });
    builder.addCase(storeCustomer.fulfilled, (state, action) => {
      const { data, error } = action.payload;
      if (!error) {
        state.customers.push(data);
      } else {
        state.error = error.name;
      }
    });
    builder.addCase(destroyCustomer.fulfilled, (state, action) => {
      const { data, error } = action.payload;
      if (!error) {
        state.customers = state.customers.filter(
          (customer) => customer.id !== data.id
        );
      } else {
        state.error = error.name;
      }
    });
    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      const { error } = action.payload;
      if (!error) {
      } else {
        state.error = error.name;
      }
    });
  },
});

export const { clearError } = customerSlice.actions;

export default customerSlice.reducer;
