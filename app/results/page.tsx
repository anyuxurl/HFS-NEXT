'use client'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import PageHeader from '@/components/page-header'
import { CenteredPageState, LoadingPageState } from '@/components/page-state'
import {
  buildTrendValue,
  PaperScoreList,
  RankSummaryCard,
  TrendSummaryCard,
  WeakSubjectCard,
} from '@/components/results-summary'
import {
  useExamOverviewV4Query,
  useExamListQuery,
  useExamOverviewQuery,
  useExamRankInfoQuery,
  useLastExamOverviewQuery,
  useUserSnapshotQuery,
} from '@/hooks/queries'
import { useRequireAuth } from '@/hooks/useRequireAuth'

const pickPositive = (...values: Array<number | undefined>) => {
  for (const v of values) {
    if (typeof v === 'number' && v > 0) return v
  }
  return undefined
}

export default function ResultsPage() {
  const { token, isAuthenticated } = useRequireAuth()
  const {
    data: lastExam,
    isPending,
    isError,
    error,
  } = useLastExamOverviewQuery(token)
  const { data: examList, isPending: isExamListPending } = useExamListQuery(token)
  const fallbackExamId =
    lastExam && Object.keys(lastExam).length > 0
      ? String(lastExam.examId)
      : examList?.[0]?.examId
  const { data: examDetail } = useExamOverviewQuery(
    token,
    fallbackExamId,
  )
  const { data: examOverviewV4 } = useExamOverviewV4Query(
    token,
    examDetail?.examId,
  )
  const { data: examRankInfo } = useExamRankInfoQuery(
    token,
    examDetail?.examId,
  )
  const { data: userSnapshot } = useUserSnapshotQuery(token)
  const advancedMode = userSnapshot?.isMember ?? false
  const hasLastExamOverview = Boolean(lastExam && Object.keys(lastExam).length > 0)

  const fallbackClassRankNumber = pickPositive(
    examRankInfo?.rank?.class,
    examDetail?.classRank,
  )
  const fallbackClassTotal = examRankInfo?.number?.class
  const fallbackClassDisplay = fallbackClassRankNumber
    ? typeof fallbackClassTotal === 'number' && fallbackClassTotal > 0
      ? `${fallbackClassRankNumber} / ${fallbackClassTotal} 人`
      : String(fallbackClassRankNumber)
    : examDetail?.classRankS || '获取失败 无此数据'

  const fallbackGradeRankNumber = pickPositive(
    examOverviewV4?.compare?.curGradeRank,
    examRankInfo?.rank?.grade,
    examDetail?.gradeRank,
  )
  const fallbackGradeTotal = examRankInfo?.number?.grade
  const fallbackGradeDisplay = fallbackGradeRankNumber
    ? typeof fallbackGradeTotal === 'number' && fallbackGradeTotal > 0
      ? `${fallbackGradeRankNumber} / ${fallbackGradeTotal} 人`
      : String(fallbackGradeRankNumber)
    : examDetail?.gradeRankS || '获取失败 无此数据'

  const fallbackGradeLevelDisplay = advancedMode
    ? typeof examDetail?.gradeRank === 'number' && examDetail.gradeRank > 0
      ? typeof examDetail.gradeDefeatRatio === 'number' &&
        examDetail.gradeDefeatRatio >= 0
        ? `${examDetail.gradeRank} (打败了全年级${examDetail.gradeDefeatRatio}%的人)`
        : String(examDetail.gradeRank)
      : examDetail?.gradeRankS || '获取失败 无此数据'
    : undefined

  if (!isAuthenticated) {
    return null
  }

  if (isPending || isExamListPending) {
    return (
      <LoadingPageState
        title='正在加载...'
        description='正在获取您的考试成绩，请稍候。'
      />
    )
  }

  if (isError) {
    return (
      <CenteredPageState
        title='获取成绩失败'
        description={error?.message ?? '请稍后重试。'}
        tone='danger'
      />
    )
  }

  if (!fallbackExamId || !examDetail) {
    return (
      <CenteredPageState
        title='暂无考试数据'
        description='目前没有可展示的考试数据。'
      />
    )
  }

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc_30%,_#f8fafc_55%,_#ffffff_100%)] p-4'>
      <div className='mx-auto max-w-4xl space-y-6'>
        <PageHeader
          title='最新考试成绩'
          description={
            hasLastExamOverview
              ? '集中查看最近一次考试的排名变化、薄弱学科和各科分数。'
              : '最近考试概览接口没有返回数据，已回退展示最新一场考试的详情。'
          }
          backHref='/'
          backLabel='返回首页'
        />
        <Card>
          <CardHeader className='gap-3'>
            <CardTitle className='font-bold text-2xl'>成绩概览</CardTitle>
            <CardDescription>
              这是最近一次考试的摘要分析。需要更完整的答题卡和单科详情，可以进入考试详情页继续查看。
              <br />
              <br />
              <Link
                href={`/exam/${fallbackExamId}`}
                className='text-sky-500 underline hover:text-sky-600'
              >
                查看这场考试的详细信息
              </Link>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Class and Grade Ranks */}
        {hasLastExamOverview && lastExam.extend && (
          <div className='grid gap-6 md:grid-cols-2'>
            <RankSummaryCard
              title='班级排名'
              rank={lastExam.extend.classRank}
              total={lastExam.extend.classStuNum}
              defeatRatio={lastExam.extend.classDefeatRatio}
              color='yellow'
            />
            <RankSummaryCard
              title='年级排名（包含所有选科）'
              rank={lastExam.extend.gradeRank}
              total={lastExam.extend.gradeStuNum}
              defeatRatio={lastExam.extend.gradeDefeatRatio}
              color='blue'
            />
          </div>
        )}
        {!hasLastExamOverview && (
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='font-medium text-lg'>排名概览</CardTitle>
              <CardDescription>
                最近考试概览接口未返回数据，当前按原版考试详情页的逻辑展示排名。
              </CardDescription>
            </CardHeader>
            <CardContent className='grid gap-4'>
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <div className='text-gray-500 text-sm'>
                    {advancedMode ? '班级排名/等第' : '班级排名'}
                  </div>
                  <div className='font-medium text-lg'>
                    {fallbackClassDisplay || '获取失败 无此数据'}
                  </div>
                </div>
                <div>
                  <div className='text-gray-500 text-sm'>年级排名</div>
                  <div className='font-medium text-lg'>
                    {fallbackGradeDisplay}
                  </div>
                </div>
              </div>
              {advancedMode && fallbackGradeLevelDisplay && (
                <div>
                  <div className='text-gray-500 text-sm'>年级排名/等第</div>
                  <div className='font-medium text-lg'>
                    {fallbackGradeLevelDisplay}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Progress Section */}
        {hasLastExamOverview &&
          lastExam.rankRaise !== undefined &&
          lastExam.scoreRaise !== undefined && (
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='font-medium text-lg'>进步情况</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6 md:grid-cols-2'>
                  <TrendSummaryCard
                    title='排名变化'
                    value={buildTrendValue(lastExam.rankRaise)}
                  />
                  <TrendSummaryCard
                    title='分数变化'
                    value={buildTrendValue(lastExam.scoreRaise, 1)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

        {/* Weakest Subject */}
        {hasLastExamOverview && lastExam.worstSubjectText && (
          <WeakSubjectCard subject={lastExam.worstSubjectText} />
        )}

        {examDetail?.papers && examDetail.papers.length > 0 ? (
          <PaperScoreList examDetail={examDetail} />
        ) : null}
      </div>
    </div>
  )
}
