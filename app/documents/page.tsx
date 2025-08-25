"use client"

import { Layout } from "@/components/layout"
import { DocumentsList } from "@/components/documents-list"
import { AssessmentAssistantProvider } from "@/contexts/assessment-assistant-context"

export default function DocumentsPage() {
  return (
    <AssessmentAssistantProvider>
      <Layout>
        <DocumentsList />
      </Layout>
    </AssessmentAssistantProvider>
  )
}
