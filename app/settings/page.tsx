'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'
import PageHeader from '@/components/page-header'
import { useUserSnapshotQuery } from '@/hooks/queries'
import { useRequireAuth } from '@/hooks/useRequireAuth'

export default function SettingsPage() {
  const router = useRouter()
  const { token, setToken, isAuthenticated } = useRequireAuth()
  const { data: userSnapshot } = useUserSnapshotQuery(token)

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className='mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-4 py-8'>
      <PageHeader
        title='设置'
        description='这里只保留当前版本仍然有效的账号信息和本地数据操作。'
        backHref='/'
        backLabel='返回首页'
      />

      <section className='app-surface-card p-6'>
        <h2 className='font-medium text-lg'>概览</h2>
        <p className='mt-2 text-gray-500 text-sm'>
          管理当前账号信息，以及本地保存的登录状态。
        </p>
      </section>

      <section className='app-surface-card p-6'>
        <h2 className='font-medium text-lg'>账号信息</h2>
        <div className='mt-4 grid gap-3 text-sm'>
          <div>
            <div className='text-gray-500'>学生姓名</div>
            <div className='font-medium'>
              {userSnapshot?.linkedStudent.studentName ?? '加载中'}
            </div>
          </div>
          <div>
            <div className='text-gray-500'>学校</div>
            <div className='font-medium'>
              {userSnapshot?.linkedStudent.schoolName ?? '加载中'}
            </div>
          </div>
          <div>
            <div className='text-gray-500'>会员状态</div>
            <div className='font-medium'>
              {userSnapshot?.isMember ? '已开通' : '未开通'}
            </div>
          </div>
        </div>
      </section>

      <section className='app-surface-card p-6'>
        <h2 className='font-medium text-lg'>本地数据</h2>
        <p className='mt-2 text-gray-500 text-sm'>
          清除本地登录信息后，需要重新登录才能继续查看成绩。
        </p>
        <Button
          type='button'
          variant='destructive'
          className='mt-4 w-full sm:w-auto'
          onClick={() => {
            setToken(undefined)
            router.replace('/login')
          }}
        >
          退出登录并清除本地数据
        </Button>
      </section>
    </div>
  )
}
