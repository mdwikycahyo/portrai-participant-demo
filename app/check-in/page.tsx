"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import dynamic from 'next/dynamic'

// Dynamically import PDF components to avoid SSR issues
const PDFViewer = dynamic(() => import('./pdf-viewer'), {
  ssr: false,
  loading: () => <div className="h-[550px] flex items-center justify-center">Loading PDF viewer...</div>
})

export default function CheckInPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("compatibility")

  const handleCheckIn = () => {
    // Simulate starting the assessment by navigating to the home page
    router.push("/home")
  }

  return (
    <div className="flex flex-col h-screen mx-auto px-6 py-6 bg-gray-50">
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          {/* Timer icon */}
          <div className="text-blue-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0012 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-500">Assessment starts in:</p>
            <p className="text-2xl font-mono font-bold text-gray-900 tracking-wider">2:59:59</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleCheckIn}
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Check-in
          </Button>
          {/* Vertical separator */}
          <div className="h-8 w-px bg-gray-300"></div>
          <UserProfileDropdown 
            showWorkHourBanner={false}
            onToggleWorkHourBanner={() => {}}
            showAssessmentReminderBanner={false}
            onToggleAssessmentReminderBanner={() => {}}
          />
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-2">
        <div className="flex border-b border-gray-200 mb-2">
          <button
            onClick={() => setActiveTab("compatibility")}
            className={`py-2 px-4 flex items-center ${activeTab === "compatibility" ? "border-b-2 border-purple-500 text-purple-500 font-semibold" : "text-gray-500 hover:text-gray-700"}`}
          >
            <span className="material-icons align-middle mr-2">radio_button_unchecked</span>
            Compatibility
          </button>
          <button
            onClick={() => setActiveTab("simulation")}
            className={`py-2 px-4 flex items-center ${activeTab === "simulation" ? "border-b-2 border-purple-500 text-purple-500 font-semibold" : "text-gray-500 hover:text-gray-700"}`}
          >
            <span className="material-icons align-middle text-gray-300 mr-2">radio_button_unchecked</span>
            Simulation
          </button>
          <button
            onClick={() => setActiveTab("platform")}
            className={`py-2 px-4 flex items-center ${activeTab === "platform" ? "border-b-2 border-purple-500 text-purple-500 font-semibold" : "text-gray-500 hover:text-gray-700"}`}
          >
            <span className="material-icons align-middle text-gray-300 mr-2">radio_button_unchecked</span>
            Platform
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow bg-white rounded-lg shadow-sm p-4">
        {/* Compatibility Tab Content */}
        {activeTab === "compatibility" && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-xl font-bold text-gray-800">Compatibility Check</h1>
              <Button
                className="flex items-center bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors text-sm"
              >
                <span className="material-icons mr-2 text-base">refresh</span>
                Check Device
              </Button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Compatibility checking is a pre-requisite procedure that allows your
              devices to be tested for its compatibility with EnGauge. The procedure
              will automatically detects any compatibility issues across your
              devices. Please contact EnGauge's helpdesk if any issues have been
              detected. Proceed to "close" the page if all of your devices are clear
              and ready to go.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col sticky top-0">
                <img
                  alt="A placeholder image."
                  className="rounded-lg w-full h-auto object-cover mb-4 flex-shrink-0 max-h-[350px]"
                  src="https://dummyimage.com/400x350/e5e5e5/666666&text=PortrAI"
                />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-gray-800 mb-2">
                  Compatibility Check Result
                </h2>
                <div className="space-y-2 flex-grow">
                  <div>
                    <div className="flex items-center text-gray-500 text-sm mb-1">
                      <span className="material-icons text-sm mr-2">videocam_off</span>
                      <p>Camera - <span className="text-red-500">Not Allowed</span></p>
                    </div>
                    <div className="relative">
                      <select
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 appearance-none text-sm"
                      >
                        <option>Nemesis HD I920</option>
                      </select>
                      <span
                        className="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >expand_more</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-500 text-sm mb-1">
                      <span className="material-icons text-sm mr-2">mic_off</span>
                      <p>Mic - <span className="text-red-500">Incompatible</span></p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-grow">
                        <select
                          className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 appearance-none text-sm"
                        >
                          <option>Razzer, Mic Lite 2.0</option>
                        </select>
                        <span
                          className="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >expand_more</span>
                      </div>
                      <button className="flex items-center text-sm text-gray-600">
                        <span className="material-icons text-sm mr-1">graphic_eq</span>
                        Test
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-500 text-sm mb-1">
                      <span className="material-icons text-sm mr-2">volume_off</span>
                      <p>Speaker - <span className="text-red-500">Not Allowed</span></p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-grow">
                        <select
                          className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 appearance-none text-sm"
                        >
                          <option>Macbook Air Speaker</option>
                        </select>
                        <span
                          className="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >expand_more</span>
                      </div>
                      <button className="flex items-center text-sm text-gray-600">
                        <span className="material-icons text-sm mr-1">graphic_eq</span>
                        Test
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-2 space-y-2 sticky bottom-0 bg-white">
                    <div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <span className="material-icons text-sm mr-2">desktop_windows</span>
                        <p>Operating System</p>
                      </div>
                      <p className="text-gray-800 ml-6 text-sm">
                        You are using OS X 10.10 Yosemite
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <span className="material-icons text-sm mr-2">public</span>
                        <p>Browser</p>
                      </div>
                      <p className="text-gray-800 ml-6 text-sm">
                        You are using Microsoft Edge (19.0.21)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Simulation Tab Content */}
        {activeTab === "simulation" && (
          <div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Simulation</h1>
            <PDFViewer />
          </div>
        )}
        
        {/* Platform Tab Content */}
        {activeTab === "platform" && (
          <div>
            <h1 className="text-xl font-bold text-gray-800">Platform</h1>
            <p className="text-gray-600">Platform content will be displayed here.</p>
          </div>
        )}
      </main>
    </div>
  )
}
