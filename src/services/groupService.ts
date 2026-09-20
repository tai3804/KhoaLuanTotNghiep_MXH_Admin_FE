import api from './api'
import { Group } from '../types/group'

export const groupService = {
  getAllGroups: async (): Promise<Group[]> => {
    const response = await api.get('/api/v1/admin/groups')
    const rawData = response.data
    const groupsList: any[] = Array.isArray(rawData)
      ? rawData
      : rawData?.data && Array.isArray(rawData.data)
      ? rawData.data
      : []

    return groupsList.map((g) => ({
      id: String(g.id || g.groupId),
      name: g.name || 'Hội nhóm',
      description: g.description || '',
      avatarUrl: g.avatarUrl,
      coverUrl: g.coverUrl,
      privacy: g.privacy || 'PUBLIC',
      owner: g.owner || {
        id: g.ownerId || 'unknown',
        username: g.ownerUsername || 'owner',
        fullName: g.ownerName || 'Trưởng nhóm',
      },
      membersCount: g.membersCount ?? g.memberCount ?? 0,
      postsCount: g.postsCount ?? 0,
      createdAt: g.createdAt || new Date().toISOString(),
      updatedAt: g.updatedAt,
    }))
  },

  deleteGroup: async (groupId: string): Promise<void> => {
    await api.delete(`/api/v1/admin/groups/${groupId}`)
  },
}
