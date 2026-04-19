import { GithubSVGIcon } from '@/components/svg'

const FORK_URL = 'https://github.com/anyuxurl/HFS-NEXT'
const UPSTREAM_URL = 'https://github.com/yanyao2333/HFS-NEXT'
const AUTHOR_SITE = 'https://134687.xyz'

export default function SiteFooter() {
  return (
    <div className='divide-y pt-10'>
      <div />
      <div className='flex flex-col gap-2 pt-2 text-gray-500 text-xs md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-col gap-1'>
          <span className='flex items-center'>
            Made by
            <a
              href={AUTHOR_SITE}
              target='_blank'
              className='ml-1 font-medium text-gray-700 underline hover:text-black'
              rel='noreferrer'
            >
              qeeryyu
            </a>
            <span className='mx-2 text-gray-300'>·</span>
            <a
              href={FORK_URL}
              target='_blank'
              className='inline-flex items-center gap-1 hover:text-gray-700'
              rel='noreferrer'
              aria-label='GitHub'
            >
              <GithubSVGIcon />
              源码
            </a>
          </span>
          <span className='text-gray-400'>
            Fork of{' '}
            <a
              href={UPSTREAM_URL}
              target='_blank'
              className='hover:underline'
              rel='noreferrer'
            >
              yanyao2333/HFS-NEXT
            </a>
          </span>
        </div>
        <span className='content-center'>
          Powered by{' '}
          <a
            href='https://vercel.com'
            target='_blank'
            className='underline'
            rel='noreferrer'
          >
            Vercel
          </a>
        </span>
      </div>
    </div>
  )
}
