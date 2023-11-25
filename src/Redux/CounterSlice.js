import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    button: "off"
}

export const CounterSlice = createSlice({

    name: "count",
    initialState,
    reducers: {
        on: (state) => {
            state.button = "on"
        },
        off: (state) => {
            state.button = "off"
        }
    }

})


export const { on, off } = CounterSlice.actions;

export default CounterSlice.reducer;