import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/button'
import SiteFooter from '@/components/siteFooter'

const FORK_URL = 'https://github.com/anyuxurl/HFS-NEXT'

export default function LandingPage() {
  return (
    <div className='mx-auto flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_#dbeafe,_#f8fafc_35%,_#ffffff_78%)] px-4 pt-6 pb-2'>
      <div className='mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8'>
        <header className='flex items-center justify-between rounded-[1.5rem] border border-white/70 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-sm'>
          <Image
            src='/images/logo.png'
            alt='HFS NEXT'
            width={165}
            height={58}
            priority
            className='h-auto w-28 md:w-32'
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
              非官方 · 好分数前端
            </div>
            <div className='space-y-4'>
              <h1 className='max-w-3xl font-semibold text-4xl tracking-tight md:text-6xl'>
                你的下一个好分数，
                <br className='hidden md:block' />
                何必是好分数？
              </h1>
              <p className='max-w-2xl text-gray-600 text-lg leading-8'>
                受够了摇一摇开屏广告、VIP 遮罩和家长版包装，于是有了这个。
                同一个接口，只做一件事：把考试列表、排名和答题卡干净地摆在你眼前。
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
                  href={FORK_URL}
                  target='_blank'
                  rel='noreferrer'
                >
                  查看源码
                </a>
              </Button>
            </div>
            <p className='text-gray-400 text-xs'>
              账号密码仅用于向好分数官方接口换 token，不会发往任何第三方。
            </p>
          </section>

          <section className='grid gap-4'>
            <div className='app-surface-card p-6'>
              <div className='font-medium text-base'>一页看完所有考试</div>
              <p className='mt-2 text-gray-600 text-sm leading-7'>
                不用每次都被开屏弹窗拦一下。列表、分数、发布时间摊开一眼看清。
              </p>
            </div>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-1'>
              <div className='app-surface-card p-6'>
                <div className='font-medium text-base'>
                  详情、排名、答题卡都在一起
                </div>
                <p className='mt-2 text-gray-600 text-sm leading-7'>
                  班级/年级排名、单科成绩、答题卡图，点进去就有。答题卡图可以放大翻页。
                </p>
              </div>
              <div className='app-surface-card p-6'>
                <div className='font-medium text-base'>一键导出截图</div>
                <p className='mt-2 text-gray-600 text-sm leading-7'>
                  想和爸妈同步？直接把当前考试的详情截图下载下来，发过去就行。
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
