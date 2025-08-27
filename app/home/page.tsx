import { Layout } from "@/components/layout"
import { ExecutiveMessage } from "@/components/executive-message"
import { NotificationCenter } from "@/components/notification-center"

export default function HomePage() {
  return (
    <Layout>
        <div className="px-6 pb-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <p className="text-gray-600 mb-2">Hai Dwiky Cahyo</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Selamat datang, GM of Earth Manufacturing</h1>
            <p className="text-gray-600">Hari kerja Anda dimulai sekarang. Kami menantikan kepemimpinan Anda.</p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-3 gap-8">
            {/* Executive Message - Takes 2 columns */}
            <div className="col-span-2">
              <ExecutiveMessage />
            </div>

            {/* Notification Center - Takes 1 column */}
            <div className="col-span-1">
              <NotificationCenter />
            </div>
          </div>
        </div>
    </Layout>
  )
}
