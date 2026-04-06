import { GithubSVGIcon } from '@/components/svg'

export default function SiteFooter({
  author = 'Roitium',
}: {
  author?: string
}) {
  return (
    <div className='divide-y pt-10'>
      <div />
      <div className='flex flex-col gap-2 pt-2 text-gray-500 text-xs md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-col gap-1'>
          <span className='flex items-center'>
            Open Source by {author} on
            <span className='ml-1 inline-flex items-center'>
              <a
                href='https://github.com/yanyao2333/HFS-NEXT'
                target='_blank'
                className='ml-1'
                rel='noreferrer'
              >
                <GithubSVGIcon />
              </a>
              <a
                href='https://github.com/yanyao2333/HFS-NEXT'
                target='_blank'
                className='ml-1 underline'
                rel='noreferrer'
              >
                yanyao2333/HFS-NEXT
              </a>
            </span>
          </span>
          <span>
            Modified by{' '}
            <a
              href='https://134687.xyz'
              target='_blank'
              className='underline'
              rel='noreferrer'
            >
              qeeryyu
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
