"use client"
import { useRouter } from "next/navigation"
import { ChevronDown, LogOut, Clock, Info } from "lucide-react" // Added Bell and Info icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch" // Import Switch
import { Label } from "@/components/ui/label" // Import Label

interface UserProfileDropdownProps {
  showWorkHourBanner: boolean
  onToggleWorkHourBanner: (checked: boolean) => void
  showAssessmentReminderBanner: boolean
  onToggleAssessmentReminderBanner: (checked: boolean) => void
}

export function UserProfileDropdown({
  showWorkHourBanner,
  onToggleWorkHourBanner,
  showAssessmentReminderBanner,
  onToggleAssessmentReminderBanner,
}: UserProfileDropdownProps) {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  const handleCheckout = () => {
    router.push("/check-in")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
          DC
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900">Hi Dwiky Cahyo</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {/* Work Hour Banner Toggle */}
        <DropdownMenuItem
          className="flex items-center justify-between cursor-default"
          onSelect={(e) => e.preventDefault()}
        >
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <Label htmlFor="work-hour-banner-dropdown" className="text-sm text-gray-900 cursor-pointer">
              5 min Alert
            </Label>
          </div>
          <Switch
            id="work-hour-banner-dropdown"
            checked={showWorkHourBanner}
            onCheckedChange={onToggleWorkHourBanner}
            className="ml-auto"
          />
        </DropdownMenuItem>
        {/* Assessment Reminder Banner Toggle */}
        <DropdownMenuItem
          className="flex items-center justify-between cursor-default"
          onSelect={(e) => e.preventDefault()}
        >
          <div className="flex items-center">
            <Info className="w-4 h-4 mr-2" />
            <Label htmlFor="assessment-reminder-banner-dropdown" className="text-sm text-gray-900 cursor-pointer">
              30 min Reminder
            </Label>
          </div>
          <Switch
            id="assessment-reminder-banner-dropdown"
            checked={showAssessmentReminderBanner}
            onCheckedChange={onToggleAssessmentReminderBanner}
            className="ml-auto"
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCheckout} className="cursor-pointer">
          <Clock className="w-4 h-4 mr-2" />
          Check Out
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
