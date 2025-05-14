// src/api/waitlist.ts

import axios from 'axios';

const API_BASE_URL = "https://task-manager-api-e7mf.onrender.com/api";

export interface WaitlistFormData {
  email: string;
  fullName: string;
  position: string;
  country: string;
}

// Add user to waitlist
export const addToWaitlist = async (userData: WaitlistFormData) => {
  const response = await axios.post(`${API_BASE_URL}/waitlist`, userData);
  return response.data;
};

// Fetch waitlist users
export const getWaitlistUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/waitlist`);
  return response.data;
};