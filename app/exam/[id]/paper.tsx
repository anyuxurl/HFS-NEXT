'use client'

import Link from 'next/link'
import { Gallery, Item } from 'react-photoswipe-gallery'
import { Card, CardContent, CardHeader } from '@/components/card'
import { Progress } from '@/components/ui/progress'
import type { BasicPaperInfo, PaperRankInfo } from '@/types/exam'
import 'photoswipe/dist/photoswipe.css'
import { useStorage } from '@/hooks/useStorage'
import {
  usePaperImageUrlsQuery,
  usePaperRankInfoQuery,
  useUserSnapshotQuery,
} from '@/hooks/queries'

function PaperRankInfoSection({
  paperRankInfo,
}: {
  paperRankInfo: PaperRankInfo
}) {
  return (
    <div className='grid gap-4 rounded-xl border border-dashed px-4 py-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <div className='text-gray-500 text-sm'>班级排名/等第</div>
          <div className='font-medium'>
            {paperRankInfo.rank.class} ({paperRankInfo.rankPart.class})
          </div>
        </div>
        <div>
          <div className='text-gray-500 text-sm'>年级排名/等第</div>
          <div className='font-medium'>
            {paperRankInfo.rank.grade} ({paperRankInfo.rankPart.grade})
          </div>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <div className='text-gray-500 text-sm'>班级平均分</div>
          <div className='font-medium'>{paperRankInfo.avg.class}</div>
        </div>
        <div>
          <div className='text-gray-500 text-sm'>年级平均分</div>
          <div className='font-medium'>{paperRankInfo.avg.grade}</div>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <div className='text-gray-500 text-sm'>班级最高分</div>
          <div className='font-medium'>{paperRankInfo.highest.class}</div>
        </div>
        <div>
          <div className='text-gray-500 text-sm'>年级最高分</div>
          <div className='font-medium'>{paperRankInfo.highest.grade}</div>
        </div>
      </div>
    </div>
  )
}

// 科目详情被隐藏时的样式
export function PaperHidingComponent(props: {
  paper: BasicPaperInfo
  changeDisplayMode: (paperId: string) => void
}) {
  return (
    <Card>
      <CardHeader
        onClick={() => {
          props.changeDisplayMode(props.paper.paperId)
        }}
        className='cursor-pointer select-none'
      >
        <div className='flex w-full items-center justify-between'>
          <div className='min-w-0'>
            <div className='truncate font-medium'>{props.paper.name}</div>
            <div className='mt-1 text-gray-500 text-sm'>
              {props.paper.score} / {props.paper.manfen}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3'
              />
            </svg>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

// 科目详情展示时的样式
export function PaperShowingComponent({
  paper,
  changeDisplayMode,
  examId,
}: {
  paper: BasicPaperInfo
  changeDisplayMode: (paperId: string) => void
  examId: number
}) {
  const [token] = useStorage('hfs_token')
  const {
    data: paperImageUrls,
    isPending: isPaperImageUrlsPending,
  } = usePaperImageUrlsQuery(
    token,
    examId,
    paper.paperId,
    paper.pid,
  )
  const { data: userSnapshot } = useUserSnapshotQuery(token)
  const {
    data: paperRankInfo,
    isPending: isPaperRankInfoPending,
    isError: isPaperRankInfoError,
  } = usePaperRankInfoQuery(token, examId, paper.paperId)
  const advancedMode = userSnapshot?.isMember ?? false

  if (!token) {
    return (
      <Card>
        <CardContent className='px-4 py-6'>
          <div className='text-gray-500 text-sm'>
            登录状态已失效，请返回
            <Link
              href='/login'
              className='ml-1 text-sky-500 underline'
            >
              登录页
            </Link>
            重新登录。
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader
        onClick={() => {
          changeDisplayMode(paper.paperId)
        }}
        className='cursor-pointer select-none'
      >
        <div className='flex w-full items-center justify-between'>
          <div className='min-w-0'>
            <div className='truncate font-medium'>{paper.name}</div>
            <div className='mt-1 text-gray-500 text-sm'>
              {paper.score} / {paper.manfen}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3'
              />
            </svg>
          </div>
        </div>
      </CardHeader>
      <CardContent className='grid select-none gap-4 px-4 pb-4'>
        <div className='grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4'>
          <div>
            <div className='text-gray-500 text-sm dark:text-gray-400'>满分</div>
            <div className='font-medium'>{paper.manfen}</div>
          </div>
          <div>
            <div className='text-gray-500 text-sm dark:text-gray-400'>得分</div>
            <div className='font-medium'>{paper.score}</div>
          </div>
        </div>
        {advancedMode && (
          <>
            {isPaperRankInfoPending ? (
              <div className='rounded-lg border border-dashed px-4 py-3 text-gray-500 text-sm'>
                正在加载单科排名分析...
              </div>
            ) : null}
            {paperRankInfo ? (
              <PaperRankInfoSection paperRankInfo={paperRankInfo} />
            ) : null}
            {!isPaperRankInfoPending && !paperRankInfo && isPaperRankInfoError ? (
              <div className='rounded-lg border border-dashed px-4 py-3 text-gray-500 text-sm'>
                单科排名接口当前不可用，暂时仅展示分数和答题卡。
              </div>
            ) : null}
          </>
        )}
        {isPaperImageUrlsPending && (
          <div className='space-y-3'>
            <div className='text-gray-500 text-sm'>正在加载答题卡...</div>
            <Progress
              value={undefined}
              className='h-2'
            />
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='h-[200px] animate-pulse rounded-lg bg-gray-100' />
              <div className='h-[200px] animate-pulse rounded-lg bg-gray-100' />
            </div>
          </div>
        )}
        <Gallery
          withCaption
          withDownloadButton
        >
          <div
            data-html2canvas-ignore='true'
            className='-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2'
          >
            {paperImageUrls?.map((url, index) => {
              return (
                <Item
                  original={url}
                  width='1024'
                  height='768'
                  key={url}
                  caption={`${paper.name} 第${index + 1}张`}
                >
                  {({ ref, open }) => (
                    <img
                      ref={ref}
                      onClick={open}
                      className='h-[220px] w-[280px] shrink-0 snap-start cursor-pointer rounded-xl border bg-white object-cover shadow-sm md:h-[240px] md:w-[340px]'
                      src={url}
                      alt={`${paper.name}_${index}`}
                      loading='lazy'
                      style={{
                        aspectRatio: '300/200',
                        objectFit: 'cover',
                      }}
                      width={300}
                      height={200}
                    />
                  )}
                </Item>
              )
            })}
          </div>
          {paperImageUrls && paperImageUrls.length === 0 && (
            <div className='text-gray-500 text-sm'>暂无答题卡图片</div>
          )}
          {paperImageUrls && paperImageUrls.length > 0 && (
            <div className='rounded-full bg-gray-50 px-3 py-1 text-gray-500 text-xs'>
              左右滑动查看更多答题卡，点击图片可放大。
            </div>
          )}
        </Gallery>
      </CardContent>
    </Card>
  )
}
