import Link from 'next/link'

export default function PageHeader({
  title,
  description,
  backHref = '/',
  backLabel = '返回',
}: {
  title: string
  description?: string
  backHref?: string
  backLabel?: string
}) {
  return (
    <div className='space-y-3'>
      <Link
        href={backHref}
        className='inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-gray-600 text-sm shadow-xs transition-colors hover:bg-gray-50 hover:text-black'
      >
        ← {backLabel}
      </Link>
      <div>
        <h1 className='font-semibold text-2xl tracking-tight'>{title}</h1>
        {description ? (
          <p className='mt-1 text-gray-500 text-sm'>{description}</p>
        ) : null}
      </div>
    </div>
  )
}
