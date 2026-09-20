import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Report, ReportFilter } from '../../types/report'

interface ReportState {
  reports: Report[]
  pendingReports: Report[]
  selectedReport: Report | null
  filter: ReportFilter
  isLoading: boolean
  actionLoading: boolean
  error: string | null
}

const initialState: ReportState = {
  reports: [],
  pendingReports: [],
  selectedReport: null,
  filter: {
    targetType: 'ALL',
    status: 'ALL',
    page: 1,
    limit: 10,
  },
  isLoading: false,
  actionLoading: false,
  error: null,
}

export const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setActionLoading: (state, action: PayloadAction<boolean>) => {
      state.actionLoading = action.payload
    },
    setReports: (state, action: PayloadAction<Report[]>) => {
      state.reports = action.payload
      state.isLoading = false
      state.error = null
    },
    setPendingReports: (state, action: PayloadAction<Report[]>) => {
      state.pendingReports = action.payload
    },
    setSelectedReport: (state, action: PayloadAction<Report | null>) => {
      state.selectedReport = action.payload
    },
    setFilter: (state, action: PayloadAction<Partial<ReportFilter>>) => {
      state.filter = { ...state.filter, ...action.payload }
    },
    resolveReportSuccess: (
      state,
      action: PayloadAction<{
        reportId: string | number
        status: Report['status']
      }>
    ) => {
      const report = state.reports.find(
        (r) => String(r.id) === String(action.payload.reportId)
      )
      if (report) {
        report.status = action.payload.status
        report.resolvedAt = new Date().toISOString()
      }
      state.pendingReports = state.pendingReports.filter(
        (r) => String(r.id) !== String(action.payload.reportId)
      )
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
  setReports,
  setPendingReports,
  setSelectedReport,
  setFilter,
  resolveReportSuccess,
  setError,
} = reportSlice.actions

export default reportSlice.reducer
