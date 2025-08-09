# CRM - Task Management System

A comprehensive task management system built with modern web technologies to streamline project workflows and team collaboration.

## 🚀 Overview

This CRM (Customer Relationship Management) system is designed as a task management platform that enables teams to organize, track, and manage tasks efficiently. The system supports role-based access control with different permissions for administrators, mentors, and members.

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Styling**: CSS-in-JS with MUI's sx prop and custom themes

## 👥 User Roles & Permissions

### 🔑 Admin
- **Task Management**: Create, edit, and delete all tasks
- **User Management**: Create, edit, and delete mentors
- **Notifications**: Mark notifications as read, view all notifications
- **Full Access**: Complete system administration capabilities

### 👨‍🏫 Mentor
- **Task Management**: Create, edit, and delete tasks they created
- **Task Assignment**: Assign tasks to members
- **Collaboration**: Work with team members on assigned projects
- **Notifications**: Receive and manage task-related notifications

### 👤 Member
- **Task Updates**: Update status of assigned tasks
- **Progress Tracking**: Monitor and update task progress
- **Notifications**: Receive notifications for assigned tasks
- **Limited Access**: View and update only assigned tasks

## ✨ Key Features

### 📋 Task Management
- Create and organize tasks with detailed information
- Set due dates, priority levels, and progress tracking
- Assign tasks to team members and mentors
- Real-time status updates and progress monitoring

### 🔔 Notification System
- Real-time notifications for task assignments and updates
- Role-based notification filtering
- Mark notifications as read/unread
- Notification history and management

### 👥 User Management
- Role-based access control
- User profile management
- Team member directory
- Mentor and member relationship management

### 📊 Dashboard & Analytics
- Task overview and statistics
- Progress tracking and reporting
- Activity monitoring
- Calendar view for task scheduling

## 🎨 UI/UX Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Customizable theme preferences
- **Material Design**: Clean, modern interface following Material Design principles
- **Data Tables**: Advanced data grids with sorting, filtering, and pagination
- **Form Validation**: Comprehensive input validation and error handling

## 🏗️ System Architecture

### Frontend Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Application pages
├── layouts/            # Layout components
├── store/              # Redux store and slices
├── api/                # API integration layer
├── routes/             # Routing configuration
└── theme/              # Material-UI theme customization
```

### Key Components
- **Task Management**: TaskList, TaskModal, TaskOverview
- **User Management**: MemberList, MentorList, UserProfile
- **Notifications**: NotificationButton, NotificationList
- **Dashboard**: Activity charts, progress tracking, calendar views

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🌟 Getting Started

1. **Login**: Access the system with your assigned role credentials
2. **Dashboard**: View your personalized dashboard with relevant tasks and notifications
3. **Task Management**: Create, assign, or update tasks based on your role permissions
4. **Notifications**: Stay updated with real-time notifications
5. **Profile**: Manage your user profile and preferences

## 📱 Responsive Design

The system is fully responsive and optimized for:
- **Desktop**: Full-featured interface with advanced data tables and charts
- **Tablet**: Touch-optimized interface with collapsible sidebars
- **Mobile**: Streamlined interface with essential features accessible on-the-go

## 🔒 Security Features

- Role-based access control (RBAC)
- Secure authentication and session management
- Input validation and sanitization
- Protected API endpoints based on user roles

## 🤝 Contributing

This project follows modern React and TypeScript best practices. When contributing:
- Use TypeScript for type safety
- Follow Material-UI design patterns
- Implement responsive design principles
- Maintain role-based access control

## 📄 License

[Add your license information here]

---

**Built with ❤️ using React, TypeScript, and Material-UI**