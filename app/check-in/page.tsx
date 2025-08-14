"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"

export default function CheckInPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("compatibility")

  const handleCheckIn = () => {
    // Simulate starting the assessment by navigating to the home page
    router.push("/home")
  }

  return (
    <div className="flex flex-col h-screen mx-auto px-6 py-6 bg-gray-50">
      {/* Header with user profile */}
      <header className="flex justify-end items-center mb-2">
        <UserProfileDropdown 
          showWorkHourBanner={false}
          onToggleWorkHourBanner={() => {}}
          showAssessmentReminderBanner={false}
          onToggleAssessmentReminderBanner={() => {}}
        />
      </header>

      {/* Timer and Check-in button */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-sm text-gray-500">Memulai assessment dalam:</p>
          <p className="text-4xl font-mono font-bold text-gray-900 tracking-wider">2:59:59</p>
        </div>
        <div className="flex space-x-4">
          <Button 
            onClick={handleCheckIn}
            className="bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Check-in
          </Button>
        </div>
      </div>

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
            <h1 className="text-xl font-bold text-gray-800">Simulation</h1>
            <p className="text-gray-600">Simulation content will be displayed here.</p>
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
