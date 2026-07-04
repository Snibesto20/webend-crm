import { create } from 'zustand'
import { createAuthSlice } from './authSlice'
import { createUISlice } from './uiSlice'
import { createClientSlice } from './clientSlice'
import { createAdminSlice } from './adminSlice'
import { createEmailSlice } from './emailSlice'
import { createUserSlice } from './userSlice'

export const useStore = create((set, get) => ({
  ...createAuthSlice(set, get),
  ...createUISlice(set, get),
  ...createClientSlice(set, get),
  ...createAdminSlice(set, get),
  ...createEmailSlice(set, get),
  ...createUserSlice(set, get)
}));