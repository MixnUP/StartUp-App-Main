import About from "@/views/AboutView.vue";
import Dashboard from "@/views/DashboardOverview.vue";
import ForgotPassword from "@/components/user/ForgotPassword.vue";
import Login from "@/components/user/Login.vue";
import Pricing from "@/views/PricingView.vue";
import Profile from "@/components/user/Profile.vue";
import ResetPassword from "@/components/user/ResetPassword.vue";
import Settings from "@/components/user/Settings.vue";
import SignUp from "@/components/user/SignUp.vue";
import { auth } from "@/firebaseConfig";
import AssessmentView from "@/views/AssessmentView.vue";
import HomeView from "@/views/HomeView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import DashboardOverview from "@/views/DashboardOverview.vue";

// Features
import Analysis from "@/components/features/Analysis.vue";
import Business from "@/components/features/Business.vue";
import ROI from "@/components/features/ROI.vue";
import TrendSeeker from "@/components/features/TrendSeeker.vue";

// Dashboard Features
import assessBusiness from "@/components/dashboard/Features/AssessBusiness.vue";
import trends from "@/components/dashboard/Features/Trends.vue";

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/overview",
      name: "Overview",
      component: DashboardOverview,
      meta: { requiresAuth: true },
    },
    {
      path: "/pricing",
      name: "Pricing",
      component: Pricing,
    },
    {
      path: "/roi",
      name: "ROI",
      component: ROI,
    },
    {
      path: "/business",
      name: "Business",
      component: Business,
    },
    {
      path: "/signup",
      name: "SignUp",
      component: SignUp,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/forgot-password",
      name: "ForgotPassword",
      component: ForgotPassword,
    },
    {
      path: "/reset-password",
      name: "ResetPassword",
      component: ResetPassword,
    },
    {
      path: "/about",
      name: "About",
      component: About,
    },
    {
      path: "/assessment",
      name: "Assessment",
      component: AssessmentView,
      meta: { requiresAuth: true },
    },
    {
      path: "/assessmentwindow",
      name: "AssessBusiness",
      component: assessBusiness,
      meta: { requiresAuth: true },
    },
    {
      path: "/analysis",
      name: "Analysis",
      component: Analysis,
    },
    {
      path: "/trend",
      name: "Trend Seeker",
      component: TrendSeeker,
    },
    {
    path: "/trends",
    name: "Trends",
    component: trends,
    meta: { requiresAuth: true },
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile,
      meta: { requiresAuth: true },
    },
    {
      path: "/settings",
      name: "Settings",
      component: Settings,
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

// Navigation Guard to protect routes
router.beforeEach((to, from, next) => {
  const user = auth.currentUser;

  // Check if the route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (user) {
      next(); // Proceed to the route if the user is authenticated
    } else {
      next("/login"); // Redirect to the login page if not authenticated
    }
  } else {
    next(); // Allow access if the route does not require authentication
  }
});

export default router;
