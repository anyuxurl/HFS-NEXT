import ExamListShell from './_components/exam-list-shell'
import LandingPage from './_components/landing-page'

export default function Home() {
  return <ExamListShell landing={<LandingPage />} />
}
