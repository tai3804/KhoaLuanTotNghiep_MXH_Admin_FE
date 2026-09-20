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
    <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-[#e4e6eb] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            Từ Điển Từ Khóa Vi Phạm (Blacklist Filter)
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#b0b3b8] mt-0.5">
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
            className="bg-slate-50 dark:bg-[#3a3b3c]/50 text-xs text-slate-900 dark:text-[#e4e6eb] px-3.5 py-2.5 rounded-xl border border-[#e4e6eb] dark:border-[#393a3b] outline-none focus:border-[#1877f2] w-64 placeholder:text-slate-400 dark:placeholder:text-[#b0b3b8]"
          />
          <Button type="submit" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Thêm
          </Button>
        </form>
      </div>

      {/* Words Grid */}
      <div className="flex flex-wrap gap-2.5 p-4 rounded-xl bg-slate-50 dark:bg-[#3a3b3c]/40 border border-[#e4e6eb] dark:border-[#393a3b] min-h-[120px] items-start">
        {words.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-[#b0b3b8] m-auto">Chưa có từ khóa nào trong danh sách đen</p>
        ) : (
          words.map((item) => (
            <div
              key={item.id}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-2xs hover:border-rose-400 transition-all text-xs"
            >
              <span className="font-semibold text-slate-800 dark:text-[#e4e6eb]">
                {item.word}
              </span>
              {item.category && (
                <Badge variant="neutral" size="sm">
                  {item.category}
                </Badge>
              )}
              <button
                onClick={() => onRemoveWord(item.id)}
                className="text-slate-400 dark:text-[#b0b3b8] hover:text-rose-500 transition-colors p-0.5 rounded-md cursor-pointer"
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
