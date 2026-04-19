'use client'

import Link from 'next/link'
import type { JSX, ReactNode, SVGProps } from 'react'
import Navbar from '@/components/navBar'
import { CenteredPageState, LoadingPageState } from '@/components/page-state'
import SiteFooter from '@/components/siteFooter'
import { useExamListQuery } from '@/hooks/queries'
import { useStorage } from '@/hooks/useStorage'

function ExamCard({
  name,
  score,
  released,
  examId,
}: {
  name: string
  score: string
  released: string
  examId: string
}): JSX.Element {
  return (
    <Link
      className='cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:bg-gray-900'
      href={`/exam/${examId}`}
    >
      <div className='flex items-center justify-between gap-3 p-4 md:p-6'>
        <div className='min-w-0'>
          <h2 className='mb-2 line-clamp-2 font-semibold text-base md:text-lg'>
            {name}
          </h2>
          <div className='mb-2 flex items-center text-sm'>
            <span className='mr-2 shrink-0 text-gray-500'>成绩:</span>
            <span className='font-medium text-gray-800'>{score}</span>
          </div>
          <div className='text-gray-500 text-sm'>发布时间: {released}</div>
        </div>
        <ArrowRightIcon className='h-5 w-5 shrink-0 text-gray-500' />
      </div>
    </Link>
  )
}

export default function ExamListShell({ landing }: { landing: ReactNode }) {
  const [token] = useStorage('hfs_token')
  const { data: examList, isError, isPending } = useExamListQuery(token)

  if (!token) {
    return <>{landing}</>
  }

  if (isError) {
    return (
      <CenteredPageState
        title='获取考试列表失败'
        description='请稍后刷新页面重试。'
        tone='danger'
      />
    )
  }

  if (isPending) {
    return (
      <LoadingPageState
        title='正在加载考试列表'
        description='请稍候。'
      />
    )
  }

  if (!examList || examList.length === 0) {
    return (
      <CenteredPageState
        title='暂无考试记录'
        description='当前账号还没有可展示的考试数据。'
      />
    )
  }

  return (
    <div className='mx-auto flex min-h-screen select-none flex-col bg-[radial-gradient(circle_at_top,_#e0f2fe,_#f8fafc_35%,_#ffffff_75%)] px-4 pt-4 pb-2 md:px-4 md:pt-6 md:pb-2 dark:bg-gray-900'>
      <Navbar />
      <div className='mt-4 max-w-[720px] self-center rounded-[1.5rem] bg-linear-to-r from-sky-500 via-cyan-500 to-teal-500 px-4 py-4 text-white shadow-[0_18px_40px_rgba(14,165,233,0.22)]'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex min-w-0 flex-1 flex-col'>
            <span className='font-semibold text-base'>最新考试排名</span>
            <span className='mt-1 text-sm text-white/85'>
              快速查看最近一次考试的班级和年级表现。
            </span>
          </div>

          <div className='w-full shrink-0 sm:w-auto'>
            <Link
              href='/results'
              className='flex items-center justify-center rounded-full border border-transparent bg-white px-4 py-2 font-medium text-black text-sm shadow-xs transition-colors hover:bg-gray-100'
            >
              立即查看
            </Link>
          </div>
        </div>
      </div>
      <div className='grid gap-4 pt-6 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4'>
        {examList.map((exam) => (
          <ExamCard
            key={exam.examId}
            name={exam.name}
            score={exam.score}
            released={exam.released}
            examId={exam.examId}
          />
        ))}
      </div>
      <div className='grow' />
      <SiteFooter />
    </div>
  )
}

function ArrowRightIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <title>向右箭头</title>
      <path d='M5 12h14' />
      <path d='m12 5 7 7-7 7' />
    </svg>
  )
}
