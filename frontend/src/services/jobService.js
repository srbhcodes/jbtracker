import axios from 'axios'
import { getToken } from './authService'

const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const api = axios.create({
  baseURL: apiBase ? `${apiBase}/api/jobs` : '/api/jobs',
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getJobs = async () => {
  const { data } = await api.get('/')
  return data
}

export const getJobById = async (id) => {
  const { data } = await api.get(`/${id}`)
  return data
}

export const createJob = async (payload) => {
  const { data } = await api.post('/', payload)
  return data
}

export const updateJob = async (id, payload) => {
  const { data } = await api.put(`/${id}`, payload)
  return data
}

export const deleteJob = async (id) => {
  const { data } = await api.delete(`/${id}`)
  return data
}
