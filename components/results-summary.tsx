import { AlertTriangle, Award, BookOpen, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Progress } from '@/components/ui/progress'
import type { ExamDetail, LastExamOverview } from '@/types/exam'

type LastExamData = Exclude<LastExamOverview, Record<string, never>>

export function RankSummaryCard({
  title,
  rank,
  total,
  defeatRatio,
  color,
}: {
  title: string
  rank: number
  total: number
  defeatRatio: number
  color: 'yellow' | 'blue'
}) {
  const iconColor = color === 'yellow' ? 'text-yellow-500' : 'text-blue-500'

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='font-medium text-lg'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Award className={`h-8 w-8 ${iconColor}`} />
            <div>
              <p className='font-bold text-3xl'>{rank}</p>
              <p className='text-gray-500 text-sm dark:text-gray-400'>
                共 {total} 人
              </p>
            </div>
          </div>
          <div className='text-right'>
            <p className='font-medium text-sm'>击败了</p>
            <p className='font-bold text-2xl text-green-600'>{defeatRatio}%</p>
            <p className='text-gray-500 text-sm dark:text-gray-400'>的同学</p>
          </div>
        </div>
        <Progress
          value={defeatRatio}
          className='mt-4 h-2'
        />
      </CardContent>
    </Card>
  )
}

export function TrendSummaryCard({
  title,
  value,
  positiveSuffix = '',
}: {
  title: string
  value: string
  positiveSuffix?: string
}) {
  const isPositive = !value.startsWith('-')

  return (
    <div className='app-surface-subtle flex items-center space-x-4 p-4'>
      <TrendingUp
        className={`h-10 w-10 ${isPositive ? 'text-green-500' : 'text-red-500'}`}
      />
      <div>
        <p className='font-medium text-sm'>{title}</p>
        <p className='font-bold text-2xl'>
          {value}
          {isPositive ? positiveSuffix : ''}
        </p>
      </div>
    </div>
  )
}

export function WeakSubjectCard({ subject }: { subject: string }) {
  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='font-medium text-lg'>需要改进</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center space-x-4'>
          <AlertTriangle className='h-10 w-10 text-amber-500' />
          <div>
            <p className='font-medium text-sm'>薄弱学科</p>
            <p className='font-bold text-xl'>{subject}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PaperScoreList({ examDetail }: { examDetail: ExamDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='font-medium text-lg'>各科成绩详情</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {examDetail.papers.map((paper) => (
            <div
              key={paper.paperId}
              className='flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0'
            >
              <div className='flex items-center space-x-3'>
                <BookOpen className='h-5 w-5 text-sky-500' />
                <span className='font-medium'>{paper.subject}</span>
              </div>
              <div className='text-right'>
                <span className='font-bold text-lg'>{paper.score}</span>
                {paper.manfen && (
                  <span className='text-gray-500 text-sm dark:text-gray-400'>
                    {' '}
                    / {paper.manfen}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function buildTrendValue(value: number, digits = 0) {
  const formatted = digits > 0 ? value.toFixed(digits) : String(value)
  return value > 0 ? `+${formatted}` : formatted
}
