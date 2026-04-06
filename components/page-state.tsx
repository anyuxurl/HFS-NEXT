import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card'
import { Progress } from '@/components/ui/progress'

export function CenteredPageState({
  title,
  description,
  tone = 'default',
  children,
}: {
  title: string
  description: ReactNode
  tone?: 'default' | 'danger'
  children?: ReactNode
}) {
  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card
        className={`w-full max-w-3xl ${
          tone === 'danger' ? 'border-red-500' : ''
        }`}
      >
        <CardHeader>
          <CardTitle
            className={`font-bold text-2xl ${
              tone === 'danger' ? 'text-red-600' : ''
            }`}
          >
            {title}
          </CardTitle>
          <CardDescription
            className={tone === 'danger' ? 'text-red-500' : undefined}
          >
            {description}
          </CardDescription>
        </CardHeader>
        {children ? <CardContent>{children}</CardContent> : null}
      </Card>
    </div>
  )
}

export function LoadingPageState({
  title,
  description,
}: {
  title: string
  description: ReactNode
}) {
  return (
    <CenteredPageState
      title={title}
      description={description}
    >
      <Progress
        value={undefined}
        className='h-2'
      />
    </CenteredPageState>
  )
}
