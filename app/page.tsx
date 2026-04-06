'use client'

import Link from 'next/link'
import type { JSX, SVGProps } from 'react'
import { Button } from '@/components/button'
import Navbar from '@/components/navBar'
import { CenteredPageState, LoadingPageState } from '@/components/page-state'
import SiteFooter from '@/components/siteFooter'
import { useExamListQuery } from '@/hooks/queries'
import { useStorage } from '@/hooks/useStorage'

// 卡片组件
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

export default function ExamSelector() {
  const [token] = useStorage('hfs_token')
  const { data: examList, isError, isPending } = useExamListQuery(token)

  if (!token) {
    return (
      <div className='mx-auto flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc_35%,_#ffffff_78%)] px-4 pt-6 pb-2'>
        <div className='mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8'>
          <header className='flex items-center justify-between rounded-[1.5rem] border border-white/70 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm'>
            <img
              src='/images/logo.png'
              alt='HFS NEXT'
              className='w-28 md:w-32'
            />
            <Link
              href='/login'
              className='rounded-full border border-gray-200 bg-white px-4 py-2 font-medium text-sm shadow-xs transition-colors hover:bg-gray-50'
            >
              前往登录
            </Link>
          </header>

          <main className='grid flex-1 items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]'>
            <section className='space-y-6'>
              <div className='inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 font-medium text-sky-700 text-sm'>
                HFS NEXT 非官方前端
              </div>
              <div className='space-y-4'>
                <h1 className='max-w-3xl font-semibold text-4xl tracking-tight md:text-6xl'>
                  更轻一点地看成绩，而不是先被原应用打断。
                </h1>
                <p className='max-w-2xl text-gray-600 text-lg leading-8'>
                  HFS NEXT 是一个基于好分数接口重新整理的前端界面，目标是把成绩、排名、各科详情和答题卡查看收拢到更直接的体验里。
                </p>
              </div>
              <div className='flex flex-col gap-3 sm:flex-row'>
                <Button
                  asChild
                  size='lg'
                  className='rounded-full px-6'
                >
                  <Link href='/login'>立即登录</Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  size='lg'
                  className='rounded-full px-6'
                >
                  <a
                    href='https://github.com/yanyao2333/HFS-NEXT'
                    target='_blank'
                    rel='noreferrer'
                  >
                    查看原项目
                  </a>
                </Button>
              </div>
            </section>

            <section className='grid gap-4'>
              <div className='app-surface-card p-6'>
                <h2 className='font-semibold text-xl'>这个项目做什么</h2>
                <p className='mt-2 text-gray-600 text-sm leading-7'>
                  用更干净的方式展示考试列表、最近一次考试概览、考试详情、答题卡和单科信息。
                </p>
              </div>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-1'>
                <div className='app-surface-card p-6'>
                  <div className='font-medium text-base'>最近考试概览</div>
                  <p className='mt-2 text-gray-600 text-sm leading-7'>
                    快速查看班级、年级表现和成绩变化。
                  </p>
                </div>
                <div className='app-surface-card p-6'>
                  <div className='font-medium text-base'>各科详情与答题卡</div>
                  <p className='mt-2 text-gray-600 text-sm leading-7'>
                    单独展开每一科，查看分数、排名信息和答题卡图片。
                  </p>
                </div>
                <div className='app-surface-card p-6'>
                  <div className='font-medium text-base'>更适合日常使用</div>
                  <p className='mt-2 text-gray-600 text-sm leading-7'>
                    去掉冗余干扰，重点保留看成绩时真正需要的内容。
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
        <SiteFooter />
      </div>
    )
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
        {examList?.map((exam) => {
          return (
            <ExamCard
              key={exam.examId}
              name={exam.name}
              score={exam.score}
              released={exam.released}
              examId={exam.examId}
            />
          )
        })}
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
