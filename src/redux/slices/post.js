import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async ()=>{
    const { data } = await axios.get('/posts')
    return data
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async ()=>{
    const { data } = await axios.get('/tags')
    return data
})
export const fetchUser = createAsyncThunk('/getUser', async (id)=>{
    const { data } = await axios.get(`/getUserByArticleId/${id}`)
    return data
})
export const fetchDeletePost = createAsyncThunk('/DeletePost', async (id)=>{
    await axios.delete(`/posts/${id}`)

})
export const fetchPopularPosts = createAsyncThunk('/PopularPosts', async ()=>{
    const {data} = await axios.get('/popular')
    return data

})
export const fetchSelectedPostsByTags = createAsyncThunk('/SelectedPostsByTags', async (tag)=>{
    const {data} = await axios.get(`/selectedPostsByTags/${tag}`)
    return data

})
export const fetchLastComments = createAsyncThunk('/lastComments', async ()=>{
    const {data} = await axios.get(`/lastComments`)
    return data

})

const initialState = {
    posts:{
        items:[],
        status: 'loading'
    },
    popularPosts:{
        items:[],
        status:'loading'
    },
    postByTag:{
        items:[],
        status:'loading'
    },
    comments:{
        items:[],
        status: 'loading',
    },
    tags:{
        items:[],
        status: 'loading',
    },
    user:{
        items:{},
        status: 'loading',
    },
}


const postsSlice = createSlice({
    name:'posts',
    initialState,
    reducers:{},
    extraReducers:{
        //получение статей
        [fetchPosts.pending]:(state) =>{
            state.posts.items = []
            state.posts.status = 'loading'
        },
        [fetchPosts.fulfilled]:(state, action) =>{
            state.posts.items = action.payload
            state.posts.status = 'loaded'
        },
        [fetchPosts.rejected]:(state) =>{
            state.posts.items = []
            state.posts.status = 'error'
        },

        //получение тегов
        [fetchTags.pending]:(state) =>{
            state.tags.items = []
            state.tags.status = 'loading'
        },
        [fetchTags.fulfilled]:(state, action) =>{
            state.tags.items = action.payload
            state.tags.status = 'loaded'
        },
        [fetchTags.rejected]:(state) =>{
            state.tags.items = []
            state.tags.status = 'error'
        },
        //получение юзера
        [fetchUser.pending]:(state) =>{
            state.user.items = {}
            state.user.status = 'loading'
        },
        [fetchUser.fulfilled]:(state, action) =>{
            state.user.items = action.payload
            state.user.status = 'loaded'
        },
        [fetchUser.rejected]:(state) =>{
            state.user.items = {}
            state.user.status = 'error'
        },

        //популярные статьи
        [fetchPopularPosts.pending]:(state) =>{
            state.popularPosts.items = []
            state.popularPosts.status = 'loading'
        },
        [fetchPopularPosts.fulfilled]:(state, action) =>{
            state.popularPosts.items = action.payload
            state.popularPosts.status = 'loaded'
        },
        [fetchPopularPosts.rejected]:(state) =>{
            state.popularPosts.items = []
            state.popularPosts.status = 'error'
        },

        //статья по тегу
        [fetchSelectedPostsByTags.pending]:(state) =>{
            state.postByTag.items = []
            state.postByTag.status = 'loading'
        },
        [fetchSelectedPostsByTags.fulfilled]:(state, action) =>{
            state.postByTag.items = action.payload
            state.postByTag.status = 'loaded'
        },
        [fetchSelectedPostsByTags.rejected]:(state) =>{
            state.postByTag.items = []
            state.postByTag.status = 'error'
        },
        //коментарии
        [fetchLastComments.pending]:(state) =>{
            state.comments.items = []
            state.comments.status = 'loading'
        },
        [fetchLastComments.fulfilled]:(state, action) =>{
            state.comments.items = action.payload
            state.comments.status = 'loaded'
        },
        [fetchLastComments.rejected]:(state) =>{
            state.comments.items = []
            state.comments.status = 'error'
        },

        //удаление статьи
        [fetchDeletePost.pending]:(state, action) =>{
            state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg)
        },
        [fetchDeletePost.rejected]:(state, action) =>{
            state.posts.status = 'error'
        },
    }
})

export const postsReducer = postsSlice.reducer