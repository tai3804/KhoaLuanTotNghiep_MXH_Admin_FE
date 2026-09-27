import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store'
import { userService } from '../services/userService'
import { postService } from '../services/postService'
import { reportService } from '../services/reportService'
import { groupService } from '../services/groupService'
import { setUsers } from '../store/slices/userSlice'
import { setPosts } from '../store/slices/postSlice'
import { setReports } from '../store/slices/reportSlice'
import { setGroups } from '../store/slices/groupSlice'

import SearchPageHeader from '../components/search/SearchPageHeader'
import SearchCategoryPills, { SearchCategoryType } from '../components/search/SearchCategoryPills'
import SearchFilterBar from '../components/search/SearchFilterBar'
import SearchEmptyState from '../components/search/SearchEmptyState'
import UserSearchResultList from '../components/search/UserSearchResultList'
import PostSearchResultList from '../components/search/PostSearchResultList'
import ReportSearchResultList from '../components/search/ReportSearchResultList'
import GroupSearchResultList from '../components/search/GroupSearchResultList'
import { Users, FileText, ShieldAlert, Users2, ArrowRight } from 'lucide-react'
import { addSearchHistory } from '../utils/searchHistory'

export const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialQuery = searchParams.get('q') || ''
  const initialCat = (searchParams.get('cat') as SearchCategoryType) || 'ALL'

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState<SearchCategoryType>(initialCat)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('NEWEST')
  const [isFetching, setIsFetching] = useState(false)

  const users = useAppSelector((state) => state.user.users)
  const posts = useAppSelector((state) => state.post.posts)
  const reports = useAppSelector((state) => state.report.reports)
  const groups = useAppSelector((state) => state.group.groups)
  const currentUser = useAppSelector((state) => state.auth.user)

  // Sync state if URL query changes
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const cat = (searchParams.get('cat') as SearchCategoryType) || 'ALL'
    setSearchQuery(q)
    setActiveCategory(cat)
    if (q.trim()) {
      addSearchHistory(q.trim())
    }
  }, [searchParams])

  // Fetch all live database records if empty or on refresh
  const fetchAllData = useCallback(async () => {
    setIsFetching(true)
    try {
      const [usersData, postsData, reportsData, groupsData] = await Promise.allSettled([
        userService.getAllUsers(),
        postService.getAllPosts(),
        reportService.getAllReports(),
        groupService.getAllGroups(),
      ])

      if (usersData.status === 'fulfilled') {
        dispatch(setUsers({ users: usersData.value }))
      }
      if (postsData.status === 'fulfilled') {
        dispatch(setPosts({ posts: postsData.value }))
      }
      if (reportsData.status === 'fulfilled') {
        dispatch(setReports(reportsData.value))
      }
      if (groupsData.status === 'fulfilled') {
        dispatch(setGroups(groupsData.value))
      }
    } catch (err) {
      console.error('Error fetching global search dataset:', err)
    } finally {
      setIsFetching(false)
    }
  }, [dispatch])

  useEffect(() => {
    if (users.length === 0 || posts.length === 0 || reports.length === 0 || groups.length === 0) {
      fetchAllData()
    }
  }, [users.length, posts.length, reports.length, groups.length, fetchAllData])

  // Update URL params helper
  const updateUrlParams = (newQuery: string, newCat: SearchCategoryType) => {
    const params: Record<string, string> = {}
    if (newQuery.trim()) params.q = newQuery.trim()
    if (newCat !== 'ALL') params.cat = newCat
    setSearchParams(params, { replace: true })
  }

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    updateUrlParams(val, activeCategory)
    if (val.trim().length >= 2) {
      addSearchHistory(val.trim())
    }
  }

  const handleCategorySelect = (cat: SearchCategoryType) => {
    setActiveCategory(cat)
    setStatusFilter('ALL')
    updateUrlParams(searchQuery, cat)
  }

  const handleClearAll = () => {
    setSearchQuery('')
    setStatusFilter('ALL')
    setSortBy('NEWEST')
    updateUrlParams('', activeCategory)
  }

  // Filter Users
  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return users
      .filter((u) => {
        const matchesQuery =
          !q ||
          u.fullName?.toLowerCase().includes(q) ||
          u.username?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phoneNumber?.toLowerCase().includes(q)

        const matchesStatus =
          statusFilter === 'ALL' ||
          (statusFilter === 'BANNED' && (u.isBanned || u.status === 'BANNED')) ||
          (statusFilter === 'ACTIVE' && !u.isBanned && u.status === 'ACTIVE') ||
          (statusFilter === 'PENDING_VERIFICATION' && u.status === 'PENDING_VERIFICATION')

        return matchesQuery && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === 'OLDEST') {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        }
        if (sortBy === 'POPULAR') {
          return ((b.followerCount || 0) + (b.postsCount || 0)) - ((a.followerCount || 0) + (a.postsCount || 0))
        }
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      })
  }, [users, searchQuery, statusFilter, sortBy])

  // Filter Posts
  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return posts
      .filter((p) => {
        const matchesQuery =
          !q ||
          p.content?.toLowerCase().includes(q) ||
          p.author?.fullName?.toLowerCase().includes(q) ||
          p.author?.username?.toLowerCase().includes(q)

        const matchesStatus =
          statusFilter === 'ALL' ||
          p.privacy === statusFilter

        return matchesQuery && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === 'OLDEST') {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        }
        if (sortBy === 'POPULAR') {
          return ((b.likesCount || 0) + (b.commentsCount || 0)) - ((a.likesCount || 0) + (a.commentsCount || 0))
        }
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      })
  }, [posts, searchQuery, statusFilter, sortBy])

  // Filter Reports
  const filteredReports = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return reports
      .filter((r) => {
        const matchesQuery =
          !q ||
          r.reason?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.targetId?.toLowerCase().includes(q) ||
          r.reporter?.fullName?.toLowerCase().includes(q) ||
          r.reporter?.username?.toLowerCase().includes(q)

        const matchesStatus =
          statusFilter === 'ALL' ||
          r.status === statusFilter

        return matchesQuery && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === 'OLDEST') {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        }
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      })
  }, [reports, searchQuery, statusFilter, sortBy])

  // Filter Groups
  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return groups
      .filter((g) => {
        const matchesQuery =
          !q ||
          g.name?.toLowerCase().includes(q) ||
          g.description?.toLowerCase().includes(q) ||
          g.owner?.fullName?.toLowerCase().includes(q) ||
          g.owner?.username?.toLowerCase().includes(q)

        const matchesStatus =
          statusFilter === 'ALL' ||
          g.privacy === statusFilter

        return matchesQuery && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === 'OLDEST') {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        }
        if (sortBy === 'POPULAR') {
          return (b.membersCount || 0) - (a.membersCount || 0)
        }
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      })
  }, [groups, searchQuery, statusFilter, sortBy])

  const counts = {
    all: filteredUsers.length + filteredPosts.length + filteredReports.length + filteredGroups.length,
    users: filteredUsers.length,
    posts: filteredPosts.length,
    reports: filteredReports.length,
    groups: filteredGroups.length,
  }

  const renderActiveTabContent = () => {
    if (activeCategory === 'USERS') {
      return filteredUsers.length > 0 ? (
        <UserSearchResultList users={filteredUsers} currentUserId={currentUser?.id} />
      ) : (
        <SearchEmptyState
          query={searchQuery}
          onReset={handleClearAll}
          onSuggestionClick={(kw) => handleSearchChange(kw)}
        />
      )
    }

    if (activeCategory === 'POSTS') {
      return filteredPosts.length > 0 ? (
        <PostSearchResultList posts={filteredPosts} />
      ) : (
        <SearchEmptyState
          query={searchQuery}
          onReset={handleClearAll}
          onSuggestionClick={(kw) => handleSearchChange(kw)}
        />
      )
    }

    if (activeCategory === 'REPORTS') {
      return filteredReports.length > 0 ? (
        <ReportSearchResultList reports={filteredReports} />
      ) : (
        <SearchEmptyState
          query={searchQuery}
          onReset={handleClearAll}
          onSuggestionClick={(kw) => handleSearchChange(kw)}
        />
      )
    }

    if (activeCategory === 'GROUPS') {
      return filteredGroups.length > 0 ? (
        <GroupSearchResultList groups={filteredGroups} />
      ) : (
        <SearchEmptyState
          query={searchQuery}
          onReset={handleClearAll}
          onSuggestionClick={(kw) => handleSearchChange(kw)}
        />
      )
    }

    // Default: 'ALL' View
    if (counts.all === 0) {
      return (
        <SearchEmptyState
          query={searchQuery}
          onReset={handleClearAll}
          onSuggestionClick={(kw) => handleSearchChange(kw)}
        />
      )
    }

    return (
      <div className="space-y-6">
        {/* Section: Users Preview */}
        {filteredUsers.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#e4e6eb]">
                  Người dùng ({filteredUsers.length})
                </h3>
              </div>
              {filteredUsers.length > 3 && (
                <button
                  onClick={() => handleCategorySelect('USERS')}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Xem toàn bộ {filteredUsers.length} người dùng <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <UserSearchResultList
              users={filteredUsers.slice(0, 5)}
              currentUserId={currentUser?.id}
            />
          </div>
        )}

        {/* Section: Posts Preview */}
        {filteredPosts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#e4e6eb]">
                  Bài viết ({filteredPosts.length})
                </h3>
              </div>
              {filteredPosts.length > 4 && (
                <button
                  onClick={() => handleCategorySelect('POSTS')}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Xem toàn bộ {filteredPosts.length} bài viết <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <PostSearchResultList posts={filteredPosts.slice(0, 4)} />
          </div>
        )}

        {/* Section: Reports Preview */}
        {filteredReports.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#e4e6eb]">
                  Báo cáo vi phạm ({filteredReports.length})
                </h3>
              </div>
              {filteredReports.length > 3 && (
                <button
                  onClick={() => handleCategorySelect('REPORTS')}
                  className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Xem toàn bộ {filteredReports.length} báo cáo <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <ReportSearchResultList reports={filteredReports.slice(0, 5)} />
          </div>
        )}

        {/* Section: Groups Preview */}
        {filteredGroups.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-cyan-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#e4e6eb]">
                  Hội nhóm ({filteredGroups.length})
                </h3>
              </div>
              {filteredGroups.length > 4 && (
                <button
                  onClick={() => handleCategorySelect('GROUPS')}
                  className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Xem toàn bộ {filteredGroups.length} hội nhóm <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <GroupSearchResultList groups={filteredGroups.slice(0, 4)} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <SearchPageHeader
        totalResults={counts.all}
        isFetching={isFetching}
        onRefresh={fetchAllData}
      />

      {/* 2. Category Selector Pills */}
      <SearchCategoryPills
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
        counts={counts}
      />

      {/* 3. Search & Filter Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        activeCategory={activeCategory}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onClearAll={handleClearAll}
        onSelectCategory={handleCategorySelect}
      />

      {/* 4. Filtered Result Lists */}
      {renderActiveTabContent()}
    </div>
  )
}

export default SearchPage
