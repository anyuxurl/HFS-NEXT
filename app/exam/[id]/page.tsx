'use client'
import { use, useCallback, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import {
  PaperHidingComponent,
  PaperShowingComponent,
} from '@/app/exam/[id]/paper'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/card'
import Navbar from '@/components/navBar'
import { Button } from '@/components/button'
import PageHeader from '@/components/page-header'
import { CenteredPageState, LoadingPageState } from '@/components/page-state'
import SiteFooter from '@/components/siteFooter'
import type { ExamObject, ExamRankInfo } from '@/types/exam'
import { formatTimestamp } from '@/utils/time'
import {
  useExamOverviewQuery,
  useExamOverviewV4Query,
  useExamRankInfoQuery,
  useUserSnapshotQuery,
} from '@/hooks/queries'
import { useRequireAuth } from '@/hooks/useRequireAuth'

function RankInfoComponent({
  rankInfo,
}: {
  rankInfo: ExamRankInfo | undefined
}) {
  return (
    <>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <div className='text-gray-500 text-sm dark:text-gray-400'>
            班级最高分
          </div>
          <div className='font-medium'>
            {rankInfo ? rankInfo.highest.class : '...'}
          </div>
        </div>
        <div>
          <div className='text-gray-500 text-sm dark:text-gray-400'>
            年级最高分
          </div>
          <div className='font-medium'>
            {rankInfo ? rankInfo.highest.grade : '...'}
          </div>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <div className='text-gray-500 text-sm dark:text-gray-400'>
            班级平均分
          </div>
          <div className='font-medium'>
            {rankInfo ? rankInfo.avg.class : '...'}
          </div>
        </div>
        <div>
          <div className='text-gray-500 text-sm dark:text-gray-400'>
            年级平均分
          </div>
          <div className='font-medium'>
            {rankInfo ? rankInfo.avg.grade : '...'}
          </div>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <div className='text-gray-500 text-sm dark:text-gray-400'>
            班级等第
          </div>
          <div className='font-medium'>
            {rankInfo ? rankInfo.rankPart.class : '...'}
          </div>
        </div>
        <div>
          <div className='text-gray-500 text-sm dark:text-gray-400'>
            年级等第
          </div>
          <div className='font-medium'>
            {rankInfo ? rankInfo.rankPart.grade : '...'}
          </div>
        </div>
      </div>
    </>
  )
}

function SummaryItem({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div>
      <div className='text-gray-500 text-sm dark:text-gray-400'>{label}</div>
      <div className='font-medium'>{value}</div>
    </div>
  )
}

export default function ExamPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params)
  const [displayedPapersMode, setDisplayedPapersMode] = useState<{
    [index: string]: boolean
  }>({})
  const pageRef = useRef(null)
  const { token, isAuthenticated } = useRequireAuth()
  const { data: userSnapshot } = useUserSnapshotQuery(token)
  const advancedMode = userSnapshot?.isMember ?? false
  const {
    data: examOverview,
    isError: isExamOverviewError,
    isPending: isExamOverviewPending,
  } = useExamOverviewQuery(token, params.id)
  const { data: examOverviewV4 } = useExamOverviewV4Query(
    token,
    examOverview?.examId,
  )
  const { data: examRankInfo } = useExamRankInfoQuery(
    token,
    examOverview?.examId,
  )

  const changeDisplayedMode = useCallback((paperId: string) => {
    setDisplayedPapersMode((prevState) => {
      return {
        ...prevState,
        [paperId]: !prevState[paperId],
      }
    })
  }, [])

  const createScreenshot = useCallback(async () => {
    if (!pageRef.current) {
      throw new Error('组件根节点ref为null???')
    }
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(pageRef.current, {
      useCORS: true,
      foreignObjectRendering: true,
    })
    const dataURL = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataURL
    link.download = `exam_${params.id}_screenshot.png`
    link.click()
  }, [params.id])

  if (!isAuthenticated) {
    return null
  }

  if (isExamOverviewError) {
    return (
      <CenteredPageState
        title='获取考试详情失败'
        description='请稍后重试，或返回上一页重新进入。'
        tone='danger'
      />
    )
  }

  if (isExamOverviewPending) {
    return (
      <LoadingPageState
        title='正在加载...'
        description='正在获取您的数据，请稍候。'
      />
    )
  }

  if (!examOverview) {
    return (
      <CenteredPageState
        title='暂无考试详情'
        description='这个考试暂时没有可展示的数据。'
      />
    )
  }

  const examObject: ExamObject = {
    detail: examOverview,
    rank: examRankInfo,
  }

  return (
    <div
      className='mx-auto flex min-h-screen select-none flex-col bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc_28%,_#ffffff_72%)] px-4 pt-4 pb-2 md:px-4 md:pt-6 md:pb-2 dark:bg-gray-900'
      ref={pageRef}
    >
      <Navbar />
      <div className='flex flex-col gap-6 pt-6'>
        <PageHeader
          title={examObject.detail.name}
          description='查看总分、排名和各科答题卡。'
          backHref='/'
          backLabel='返回考试列表'
        />
        <Card>
          <CardHeader className='gap-4'>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
              <div>
                <CardTitle>{examObject.detail.name}</CardTitle>
                <CardDescription className='mt-1'>
                  考试详情与排名概览
                </CardDescription>
              </div>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  toast.promise(
                    createScreenshot(),
                    {
                      loading: '正在截图',
                      success: (
                        <span>
                          成功创建并下载截图！
                          <br />
                          (答题卡图片空白是正常的)
                        </span>
                      ),
                      error: (err: string) => `创建截图失败，原因：${err}`,
                    },
                    {
                      error: {
                        duration: 5000,
                      },
                      success: {
                        duration: 5000,
                      },
                    },
                  )
                }}
                className='w-full sm:w-auto'
              >
                导出截图
              </Button>
            </div>
            <div
              data-html2canvas-ignore='true'
              className='hidden'
            >
            </div>
          </CardHeader>

          <CardContent className='grid gap-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <SummaryItem
                label='考试名'
                value={examObject.detail.name}
              />
              <SummaryItem
                label='考试发布时间'
                value={formatTimestamp(examObject.detail.time as number)}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <SummaryItem
                label='满分'
                value={examObject.detail.manfen}
              />
              <SummaryItem
                label='得分'
                value={examObject.detail.score}
              />
            </div>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <SummaryItem
                label={advancedMode ? '班级排名/等第' : '班级排名'}
                value={
                  advancedMode
                    ? `${examObject.detail.classRank} (打败了全班${examObject.detail.classDefeatRatio}%的人)`
                    : examObject.detail.classRankS
                }
              />
              <SummaryItem
                label='年级排名'
                value={
                  examOverviewV4?.compare?.curGradeRank ??
                  examObject.detail.gradeRank ??
                  '获取失败 无此数据'
                }
              />
            </div>
            {advancedMode && (
              <SummaryItem
                label='年级排名/等第'
                value={`${examObject.detail.gradeRank} (打败了全年级${examObject.detail.gradeDefeatRatio}%的人)`}
              />
            )}
            {advancedMode && <RankInfoComponent rankInfo={examObject?.rank} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>各科分析</CardTitle>
            <CardDescription>点击学科卡片可展开答题卡与分数详情。</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4'>
              {examObject.detail.papers.map((item) => {
                const isDisplayed = displayedPapersMode[item.paperId]

                return isDisplayed ? (
                  <PaperShowingComponent
                    key={item.paperId}
                    paper={item}
                    changeDisplayMode={changeDisplayedMode}
                    examId={examObject.detail.examId}
                  />
                ) : (
                  <PaperHidingComponent
                    changeDisplayMode={changeDisplayedMode}
                    paper={item}
                    key={item.paperId}
                  />
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      <SiteFooter />
    </div>
  )
}
