"use client";

import { ComponentState, ComponentStatus, ComponentDisplay } from "../types";

interface CompatibilityTabProps {
  componentStates: ComponentState;
}

export function CompatibilityTab({
  componentStates,
}: CompatibilityTabProps) {
  const getComponentDisplay = (
    status: ComponentStatus,
    componentName: string
  ): ComponentDisplay => {
    switch (status) {
      case "pending":
        return {
          icon:
            componentName === "camera"
              ? "videocam_off"
              : componentName === "mic"
              ? "mic_off"
              : componentName === "speaker"
              ? "volume_off"
              : componentName === "os"
              ? "desktop_windows"
              : "public",
          statusText: "Not Checked",
          statusColor: "text-gray-500",
          iconColor: "text-gray-400",
        };
      case "checking":
        return {
          icon: "sync",
          statusText: "Checking...",
          statusColor: "text-blue-500",
          iconColor: "text-blue-500 animate-spin",
        };
      case "compatible":
        return {
          icon: "check_circle",
          statusText: "Compatible",
          statusColor: "text-green-500",
          iconColor: "text-green-500",
        };
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold text-gray-800">
          Compatibility Check
        </h1>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Compatibility checking is a pre-requisite procedure that allows
        your devices to be tested for its compatibility with EnGauge. The
        procedure will automatically detects any compatibility issues
        across your devices. Please contact EnGauge's helpdesk if any
        issues have been detected. Proceed to "close" the page if all of
        your devices are clear and ready to go.
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
                <span
                  className={`material-icons text-sm mr-2 ${
                    getComponentDisplay(componentStates.camera, "camera")
                      .iconColor
                  }`}
                >
                  {
                    getComponentDisplay(componentStates.camera, "camera")
                      .icon
                  }
                </span>
                <p>
                  Camera -{" "}
                  <span
                    className={
                      getComponentDisplay(
                        componentStates.camera,
                        "camera"
                      ).statusColor
                    }
                  >
                    {
                      getComponentDisplay(
                        componentStates.camera,
                        "camera"
                      ).statusText
                    }
                  </span>
                </p>
              </div>
              <div className="relative">
                <select
                  disabled={componentStates.camera === "checking"}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 appearance-none text-sm disabled:opacity-50"
                >
                  <option>Nemesis HD I920</option>
                </select>
                <span className="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  expand_more
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center text-gray-500 text-sm mb-1">
                <span
                  className={`material-icons text-sm mr-2 ${
                    getComponentDisplay(componentStates.mic, "mic")
                      .iconColor
                  }`}
                >
                  {getComponentDisplay(componentStates.mic, "mic").icon}
                </span>
                <p>
                  Mic -{" "}
                  <span
                    className={
                      getComponentDisplay(componentStates.mic, "mic")
                        .statusColor
                    }
                  >
                    {
                      getComponentDisplay(componentStates.mic, "mic")
                        .statusText
                    }
                  </span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative flex-grow">
                  <select
                    disabled={componentStates.mic === "checking"}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 appearance-none text-sm disabled:opacity-50"
                  >
                    <option>Razzer, Mic Lite 2.0</option>
                  </select>
                  <span className="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center text-gray-500 text-sm mb-1">
                <span
                  className={`material-icons text-sm mr-2 ${
                    getComponentDisplay(
                      componentStates.speaker,
                      "speaker"
                    ).iconColor
                  }`}
                >
                  {
                    getComponentDisplay(
                      componentStates.speaker,
                      "speaker"
                    ).icon
                  }
                </span>
                <p>
                  Speaker -{" "}
                  <span
                    className={
                      getComponentDisplay(
                        componentStates.speaker,
                        "speaker"
                      ).statusColor
                    }
                  >
                    {
                      getComponentDisplay(
                        componentStates.speaker,
                        "speaker"
                      ).statusText
                    }
                  </span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative flex-grow">
                  <select
                    disabled={componentStates.speaker === "checking"}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 appearance-none text-sm disabled:opacity-50"
                  >
                    <option>Macbook Air Speaker</option>
                  </select>
                  <span className="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-2 space-y-2 sticky bottom-0 bg-white">
              <div>
                <div className="flex items-center text-gray-500 text-sm">
                  <span
                    className={`material-icons text-sm mr-2 ${
                      getComponentDisplay(componentStates.os, "os")
                        .iconColor
                    }`}
                  >
                    {getComponentDisplay(componentStates.os, "os").icon}
                  </span>
                  <p>
                    Operating System -{" "}
                    <span
                      className={
                        getComponentDisplay(componentStates.os, "os")
                          .statusColor
                      }
                    >
                      {
                        getComponentDisplay(componentStates.os, "os")
                          .statusText
                      }
                    </span>
                  </p>
                </div>
                <p className="text-gray-800 ml-6 text-sm">
                  You are using OS X 10.10 Yosemite
                </p>
              </div>
              <div>
                <div className="flex items-center text-gray-500 text-sm">
                  <span
                    className={`material-icons text-sm mr-2 ${
                      getComponentDisplay(
                        componentStates.browser,
                        "browser"
                      ).iconColor
                    }`}
                  >
                    {
                      getComponentDisplay(
                        componentStates.browser,
                        "browser"
                      ).icon
                    }
                  </span>
                  <p>
                    Browser -{" "}
                    <span
                      className={
                        getComponentDisplay(
                          componentStates.browser,
                          "browser"
                        ).statusColor
                      }
                    >
                      {
                        getComponentDisplay(
                          componentStates.browser,
                          "browser"
                        ).statusText
                      }
                    </span>
                  </p>
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
  );
}