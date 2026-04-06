import { skipToken, useQuery } from '@tanstack/react-query'
import { fetchHFSApiFromServer } from '@/app/actions'
import { HFS_APIs } from '@/app/constants'
import type {
  ExamDetail,
  ExamListResponse,
  ExamOverviewV4,
  ExamRankInfo,
  LastExamOverview,
  PaperRankInfo,
  UserSnapshot,
} from '@/types/exam'
import { formatTimestamp } from '@/utils/time'

export const queryKeys = {
  all: () => ['hfsnext'],
  authScope: (token?: string) => [...queryKeys.all(), token ?? 'anonymous'],
  examList: (token?: string) => [...queryKeys.authScope(token), 'examList'],
  userSnapshot: (token?: string) => [...queryKeys.authScope(token), 'userSnapshot'],
  lastExamOverview: (token?: string) => [...queryKeys.authScope(token), 'lastExamOverview'],
  examOverview: (token: string | undefined, examId: string) => [
    ...queryKeys.authScope(token),
    'examOverview',
    examId,
  ],
  examOverviewV4: (token: string | undefined, examId: number) => [
    ...queryKeys.authScope(token),
    'examOverviewV4',
    examId,
  ],
  examRankInfo: (token: string | undefined, examId: number) => [
    ...queryKeys.authScope(token),
    'examRankInfo',
    examId,
  ],
  answerPicture: (
    token: string | undefined,
    examId: number,
    paperId: string,
    pid: string,
  ) => [
    ...queryKeys.authScope(token),
    'answerPicture',
    examId,
    paperId,
    pid,
  ],
  paperRankInfo: (token: string | undefined, examId: number, paperId: string) => [
    ...queryKeys.authScope(token),
    'paperRankInfo',
    examId,
    paperId,
  ],
}

export const useExamListQuery = (token: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.examList(token),
    queryFn: token
      ? async () => {
          const response = await fetchHFSApiFromServer<ExamListResponse>(
            HFS_APIs.examList,
            {
              method: 'GET',
              token: token,
            },
          )
          if (!response.ok) {
            throw new Error(response.errMsg || '获取考试列表失败')
          }
          return response.payload.list
        }
      : skipToken,
    select: (exams) =>
      exams.map((exam) => ({
        name: exam.name,
        score: `${exam.score}/${exam.manfen}`,
        released: formatTimestamp(exam.time),
        examId: exam.examId,
      })),
  })
}

export const useUserSnapshotQuery = (token: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.userSnapshot(token),
    queryFn: token
      ? async () => {
          const response = await fetchHFSApiFromServer<UserSnapshot>(
            HFS_APIs.userSnapshot,
            {
              method: 'GET',
              token: token,
            },
          )
          if (!response.ok) {
            throw new Error(response.errMsg || '获取用户信息失败')
          }
          return response.payload
        }
      : skipToken,
    staleTime: 1000 * 60 * 240, // 缓存 4h
  })
}

export const useExamOverviewQuery = (
  token: string | undefined,
  id?: string,
) => {
  return useQuery({
    queryKey: token && id ? queryKeys.examOverview(token, id) : ['hfsnext', 'examOverview', 'anonymous'],
    queryFn:
      token && id
        ? async () => {
            const response = await fetchHFSApiFromServer<ExamDetail>(
              HFS_APIs.examOverview,
              {
                method: 'GET',
                token: token,
                getParams: {
                  examId: id,
                },
              },
            )
            if (!response.ok) {
              throw new Error(response.errMsg || '获取考试详情失败')
            }
            return response.payload
          }
        : skipToken,
  })
}

export const usePaperImageUrlsQuery = (
  token: string | undefined,
  examId: number,
  paperId: string,
  pid: string,
) => {
  return useQuery({
    queryKey: queryKeys.answerPicture(token, examId, paperId, pid),
    queryFn: token
      ? async () => {
          const response = await fetchHFSApiFromServer<{ url: string[] }>(
            HFS_APIs.answerPicture,
            {
              method: 'GET',
              token: token,
              getParams: {
                paperId: paperId,
                pid: pid,
                examId: examId,
              },
            },
          )
          if (!response.ok) {
            throw new Error(response.errMsg || '获取答题卡图片失败')
          }
          return response.payload.url
        }
      : skipToken,
  })
}

export const useExamRankInfoQuery = (
  token: string | undefined,
  examId?: number,
) => {
  return useQuery({
    queryKey:
      token && examId !== undefined
        ? queryKeys.examRankInfo(token, examId)
        : ['hfsnext', 'examRankInfo', 'anonymous'],
    queryFn:
      token && examId !== undefined
        ? async () => {
            const response = await fetchHFSApiFromServer<ExamRankInfo>(
              HFS_APIs.examRankInfo,
              {
                method: 'GET',
                token,
                getParams: {
                  examId,
                },
              },
            )
            if (!response.ok) {
              throw new Error(response.errMsg || '获取考试排名失败')
            }
            return {
              ...response.payload,
              defeatRatio:
                response.payload.defeatRatio ?? response.payload.defeatRation,
            }
          }
        : skipToken,
  })
}

export const usePaperRankInfoQuery = (
  token: string | undefined,
  examId?: number,
  paperId?: string,
) => {
  return useQuery({
    queryKey:
      token && examId !== undefined && paperId
        ? queryKeys.paperRankInfo(token, examId, paperId)
        : ['hfsnext', 'paperRankInfo', 'anonymous'],
    queryFn:
      token && examId !== undefined && paperId
        ? async () => {
            const response = await fetchHFSApiFromServer<PaperRankInfo>(
              HFS_APIs.paperRankInfo,
              {
                method: 'GET',
                token,
                getParams: {
                  examId,
                  paperId,
                },
              },
            )
            if (!response.ok) {
              throw new Error(response.errMsg || '获取单科排名失败')
            }
            return response.payload
          }
        : skipToken,
  })
}

export const useLastExamOverviewQuery = (token: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.lastExamOverview(token),
    queryFn: token
      ? async () => {
          const response = await fetchHFSApiFromServer<LastExamOverview>(
            HFS_APIs.lastExamOverview,
            {
              method: 'GET',
              token: token,
            },
          )
          if (!response.ok) {
            throw new Error(response.errMsg || '获取最近考试详情失败')
          }
          return response.payload
        }
      : skipToken,
  })
}

export const useExamOverviewV4Query = (
  token: string | undefined,
  examId?: number,
) => {
  return useQuery({
    queryKey:
      token && examId !== undefined
        ? queryKeys.examOverviewV4(token, examId)
        : ['hfsnext', 'examOverviewV4', 'anonymous'],
    queryFn:
      token && examId !== undefined
        ? async () => {
            const response = await fetchHFSApiFromServer<ExamOverviewV4>(
              HFS_APIs.examOverviewV4,
              {
                method: 'GET',
                token: token,
                getParams: {
                  examId: String(examId),
                },
              },
            )
            if (!response.ok) {
              throw new Error(response.errMsg || '获取年级排名失败')
            }
            return response.payload
          }
        : skipToken,
  })
}
