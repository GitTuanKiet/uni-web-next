import { nanoid } from '@/lib/utils'
import { Chat } from '@/components'
import { AI, getMissingKeys } from '@/lib/chat'
import { validateRequest } from '@/lib/auth'

export const metadata = {
  title: 'Next.js AI Chatbot'
}

export default async function IndexPage() {
  const id = nanoid()
  const { session } = await validateRequest()
  const missingKeys = await getMissingKeys()

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} session={session} missingKeys={missingKeys} />
    </AI>
  )
}
