import { LoadingPageState } from '@/components/page-state'

export default function Loading() {
  return (
    <LoadingPageState
      title='正在加载...'
      description='正在获取考试详情，请稍候。'
    />
  )
}
