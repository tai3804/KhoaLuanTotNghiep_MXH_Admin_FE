import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'
import { ReportCategoryStat } from '../../types/dashboard'
import { useAppSelector } from '../../store'

export interface CategoryPieChartProps {
  data: ReportCategoryStat[]
}

const COLORS = ['#1877f2', '#f02849', '#f7b125', '#45bd62', '#2abba7', '#8a8d91']

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  const isDark = useAppSelector((state) => state.theme.isDark)

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#242526] border border-[#e4e6eb] dark:border-[#393a3b] shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-[#e4e6eb]">
          Phân Bố Báo Cáo Vi Phạm
        </h3>
        <p className="text-xs text-slate-500 dark:text-[#b0b3b8] mt-0.5">
          Tỷ lệ vi phạm theo nội dung bị tố cáo
        </p>
      </div>

      <div className="h-56 w-full my-2 flex items-center justify-center">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-slate-400 dark:text-[#b0b3b8] gap-2">
            <PieIcon className="w-8 h-8 opacity-40" />
            <span className="text-xs">Chưa có phân loại báo cáo</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#242526' : '#ffffff',
                  borderColor: isDark ? '#393a3b' : '#e4e6eb',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: isDark ? '#e4e6eb' : '#050505',
                }}
              />
              <Pie
                data={data}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend list */}
      {data.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-[#e4e6eb] dark:border-[#393a3b] text-xs">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-slate-600 dark:text-[#b0b3b8]">{item.category}</span>
              </div>
              <span className="font-semibold text-slate-800 dark:text-[#e4e6eb]">
                {item.percentage}% ({item.count})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryPieChart

