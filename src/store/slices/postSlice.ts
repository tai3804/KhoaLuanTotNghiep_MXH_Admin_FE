import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Post, PostFilter } from '../../types/post'

interface PostState {
  posts: Post[]
  totalCount: number
  selectedPost: Post | null
  filter: PostFilter
  isLoading: boolean
  actionLoading: boolean
  error: string | null
}

const initialState: PostState = {
  posts: [],
  totalCount: 0,
  selectedPost: null,
  filter: {
    searchQuery: '',
    privacy: 'ALL',
    status: 'ALL',
    page: 1,
    limit: 10,
  },
  isLoading: false,
  actionLoading: false,
  error: null,
}

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setActionLoading: (state, action: PayloadAction<boolean>) => {
      state.actionLoading = action.payload
    },
    setPosts: (
      state,
      action: PayloadAction<{ posts: Post[]; totalCount?: number }>
    ) => {
      state.posts = action.payload.posts
      state.totalCount = action.payload.totalCount ?? action.payload.posts.length
      state.isLoading = false
      state.error = null
    },
    setSelectedPost: (state, action: PayloadAction<Post | null>) => {
      state.selectedPost = action.payload
    },
    setFilter: (state, action: PayloadAction<Partial<PostFilter>>) => {
      state.filter = { ...state.filter, ...action.payload }
    },
    deletePostSuccess: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((p) => p.id !== action.payload)
      if (state.selectedPost && state.selectedPost.id === action.payload) {
        state.selectedPost = null
      }
      state.actionLoading = false
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
      state.actionLoading = false
    },
  },
})

export const {
  setLoading,
  setActionLoading,
  setPosts,
  setSelectedPost,
  setFilter,
  deletePostSuccess,
  setError,
} = postSlice.actions

export default postSlice.reducer
