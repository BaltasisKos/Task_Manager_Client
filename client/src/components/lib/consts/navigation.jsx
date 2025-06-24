import {MdSpaceDashboard} from 'react-icons/md'
import { SiGoogletasks } from "react-icons/si";
import { LiaTasksSolid } from "react-icons/lia";
import { RiProgress5Line } from "react-icons/ri";
import { PiMastodonLogoFill } from "react-icons/pi";
import { RiTeamLine } from "react-icons/ri";
import { BsFillTrash3Fill } from "react-icons/bs";
import {HiOutlineCog, HiOutlineQuestionMarkCircle} from "react-icons/hi"


export const DASHBOARD_SIDEBAR_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/dashboard',
		icon: <MdSpaceDashboard />
	},
	{
		key: 'tasks',
		label: 'Tasks',
		path: '/tasks',
		icon: <LiaTasksSolid />
	},
	{
		key: 'completed',
		label: 'Completed',
		path: '/completed',
		icon: <SiGoogletasks/>
	},
	{
		key: 'inprogress',
		label: 'In Progress',
		path: '/inprogress',
		icon: <RiProgress5Line />
	},
	{
		key: 'todo',
		label: 'To Do',
		path: '/todo',
		icon: <PiMastodonLogoFill />
	},
	{
		key: 'team',
		label: 'Team',
		path: '/team',
		icon: <RiTeamLine/>
	},
  {
		key: 'trash',
		label: 'Trash',
		path: '/trash',
		icon: <BsFillTrash3Fill />
	}
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		path: '/settings',
		icon: <HiOutlineCog />
	},
	{
		key: 'helpandsupport',
		label: 'Help And Support',
		path: '/support',
		icon: <HiOutlineQuestionMarkCircle/>
	}
]

