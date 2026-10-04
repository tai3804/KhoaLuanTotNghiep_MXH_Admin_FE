import React, { useState } from 'react'
import { Plus, Trash2, ShieldAlert } from 'lucide-react'
import { BlacklistedWord } from '../../types/settings'
import Button from '../common/Button'
import Badge from '../common/Badge'

export interface BlacklistWordManagerProps {
  words: BlacklistedWord[]
  isLoading?: boolean
  onAddWord: (word: string) => void
  onRemoveWord: (id: number | string) => void
}

export const BlacklistWordManager: React.FC<BlacklistWordManagerProps> = ({
  words,
  isLoading = false,
  onAddWord,
  onRemoveWord,
}) => {
  const [newWord, setNewWord] = useState('')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWord.trim()) return
    onAddWord(newWord.trim())
    setNewWord('')
  }

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-[#E4E6EB] dark:border-[#393A3B] shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#050505] dark:text-[#E4E6EB] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#FA383E]" />
            Từ Điển Từ Khóa Vi Phạm (Blacklist Filter)
          </h3>
          <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] mt-0.5">
            Các bài viết, bình luận chứa từ khóa trong danh sách này sẽ bị tự động cảnh báo hoặc che giấu
          </p>
        </div>

        {/* Add Word Form */}
        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Thêm từ khóa cấm mới..."
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="bg-[#F0F2F5] dark:bg-[#3A3B3C] text-xs text-[#050505] dark:text-[#E4E6EB] px-3.5 py-2.5 rounded-xl border border-[#E4E6EB] dark:border-[#393A3B] outline-none focus:ring-2 focus:ring-[#0866FF]/20 focus:border-[#0866FF] w-64 placeholder-[#65676B] dark:placeholder-[#B0B3B8]"
          />
          <Button type="submit" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Thêm
          </Button>
        </form>
      </div>

      {/* Words Grid */}
      <div className="flex flex-wrap gap-2.5 p-4 rounded-xl bg-[#F0F2F5] dark:bg-[#18191A]/60 border border-[#E4E6EB] dark:border-[#393A3B] min-h-[120px] items-start">
        {words.length === 0 ? (
          <p className="text-xs text-[#65676B] dark:text-[#B0B3B8] m-auto">Chưa có từ khóa nào trong danh sách đen</p>
        ) : (
          words.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#242526] border border-[#E4E6EB] dark:border-[#393A3B] shadow-2xs hover:border-[#FA383E]/50 transition-all text-xs"
            >
              <span className="font-semibold text-[#050505] dark:text-[#E4E6EB]">
                {item.word}
              </span>
              {item.category && (
                <Badge variant="neutral" size="sm">
                  {item.category}
                </Badge>
              )}
              <button
                onClick={() => onRemoveWord(item.id)}
                className="text-[#65676B] dark:text-[#B0B3B8] hover:text-[#FA383E] transition-colors p-0.5 rounded-md cursor-pointer"
                title="Xóa từ khóa này"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default BlacklistWordManager
