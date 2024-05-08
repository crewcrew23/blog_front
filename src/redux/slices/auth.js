import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk('auth/fetchUserData', async (params) => {
    const { data } = await axios.post('/login', params)
    return data
});
export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
    const { data } = await axios.get('/profile')
    return data
});
export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const {data}  = await axios.post('/registration',params)
        .catch((err) => {
           const errorMessage = err.response.data.map(item => item.msg)
            alert(errorMessage)
        })

    return data
});

const initialState = {
        data: null,
        status: 'loading',

}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logout:(state)=>{
            state.data = null
        }
    },
    extraReducers: {
        [fetchAuth.pending]: (state) => {
            state.status = 'loading'
            state.data = null
        },
        [fetchAuth.fulfilled]: (state, action) => {
            state.status = 'loaded'
            state.data = action.payload
        },
        [fetchAuth.rejected]: (state) => {
            state.data = null
            state.status = 'error'
        },

        [fetchAuthMe.pending]: (state) => {
            state.status = 'loading'
            state.data = null
        },
        [fetchAuthMe.fulfilled]: (state, action) => {
            state.status = 'loaded'
            state.data = action.payload
        },
        [fetchAuthMe.rejected]: (state) => {
            state.data = null
            state.status = 'error'
        },

        [fetchRegister.pending]: (state) => {
            state.status = 'loading'
            state.data = null
        },
        [fetchRegister.fulfilled]: (state, action) => {
            state.status = 'loaded'
            state.data = action.payload
        },
        [fetchRegister.rejected]: (state) => {
            state.data = null
            state.status = 'error'
        },
    }
});
export default initialState;

export const selectIsAuth = state => Boolean(state.auth.data)
export const {logout} = authSlice.actions
export const authReducer = authSlice.reducer;
