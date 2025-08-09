/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from 'layouts/main-layout';
import AuthLayout from 'layouts/auth-layout';
import Splash from 'components/loader/Splash';
import PageLoader from 'components/loader/PageLoader';
const TaskList = lazy(() => import('pages/task/TaskList'));
const MentorList = lazy(() => import('pages/mentor/MentorList'));
const MemberList = lazy(() => import('pages/member/MemberList'));
const NotificationList = lazy(() => import('pages/notification/NotificationList'));

const App = lazy(() => import('App'));
const Dashboard = lazy(() => import('pages/dashboard'));
const Login = lazy(() => import('pages/authentication/Login'));
const Register = lazy(() => import('pages/authentication/Register'));
const ViewProfile = lazy(() => import('pages/profile/ViewProfile'));

const router = createBrowserRouter(
  [
    {
      element: (
        <Suspense fallback={<Splash />}>
          <App />
        </Suspense>
      ),
      children: [
        {
          path: '/',
          element: <Navigate to="/login" replace />,
        },
        {
          element: (
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </MainLayout>
          ),
          children: [
            {
              path: '/dashboard',
              element: <Dashboard />,
            },
            {
              path: '/profile',
              element: <ViewProfile />,
            },
            {
              path: '/tasks-list',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <TaskList />
                </Suspense>
              ),
            },
            {
              path: '/notifications',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <NotificationList />
                </Suspense>
              ),
            },
            {
              path: '/mentors-list',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <MentorList />
                </Suspense>
              ),
            },
            {
              path: '/members-list',
              element: (
                <Suspense fallback={<PageLoader />}>
                  <MemberList />
                </Suspense>
              ),
            },
          ],
        },
        {
          element: (
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          ),
          children: [
            {
              path: '/login',
              element: <Login />,
            },
            {
              path: '/auth/callback',
              element: <Login />,
            },
            {
              path: '/register',
              element: <Register />,
            },
            {
              path: '/auth/register/callback',
              element: <Register />,
            },
          ],
        },
      ],
    },
  ],
  {
    basename: '/',
  },
);

export default router;
