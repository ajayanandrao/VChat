
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./Redux/CounterSlice";


export const Store = configureStore({
    reducer: {
        counter: counterReducer,
    }
})

