// src/store/useStore.js
import { create } from 'zustand'
import { createAuthSlice } from './authSlice'
import { createUISlice } from './uiSlice'
import { createClientSlice } from './clientSlice'
import { createAdminSlice } from './adminSlice'
import { createEmailSlice } from './emailSlice'
import { createUserSlice } from './userSlice'

export const TAG_PRIORITY = { 
  'Active Client': 100, 'approved': 90, 'potential 10': 85, 'potential 9': 84, 
  'potential 8': 83, 'potential 7': 82, 'potential 6': 81, 'potential 5': 80, 
  'potential 4': 79, 'potential 3': 78, 'potential 2': 77, 'potential 1': 76, 
  'pending': 50, 'Archived Client': 10, 'disapproved': 0 
};

export const useStore = create((set, get) => ({
  ...createAuthSlice(set, get),
  ...createUISlice(set, get),
  ...createClientSlice(set, get),
  ...createAdminSlice(set, get),
  ...createEmailSlice(set, get),
  ...createUserSlice(set, get)
}));