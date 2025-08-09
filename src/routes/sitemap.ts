export interface SubMenuItem {
  name: string;
  pathName: string;
  path: string;
  icon?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  subheader: string;
  path?: string;
  icon?: string;
  avatar?: string;
  active?: boolean;
  items?: SubMenuItem[];
}

const rawSitemap: MenuItem[] = [
  {
    id: 'dashboard',
    subheader: 'Overview',
    path: '/dashboard',
    icon: 'hugeicons:grid-view',
    active: true,
  },
  {
    id: 'task',
    subheader: 'Task',
    path: '/tasks-list',
    icon: 'hugeicons:book-open-01',
  },
  {
    id: 'notifications',
    subheader: 'Notifications',
    path: '/notifications',
    icon: 'mynaui:bell',
  },
  {
    id: 'mentors',
    subheader: 'Mentors',
    path: '/mentors-list',
    icon: 'mynaui:user-hexagon',
  },
  {
    id: 'members',
    subheader: 'Member',
    path: '/members-list',
    icon: 'mynaui:user-hexagon',
  },
];

export default rawSitemap;
