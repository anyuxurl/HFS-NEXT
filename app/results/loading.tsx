import { LoadingPageState } from '@/components/page-state'

export default function Loading() {
  return (
    <LoadingPageState
      title='正在加载...'
      description='正在获取最近考试成绩，请稍候。'
    />
  )
}
