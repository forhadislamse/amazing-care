import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { TermsAndConditionsRoutes } from "../modules/TermsAndConditions/TermsAndConditions.routes";
import { PrivacyPolicyRoutes } from "../modules/PrivacyPolicy/PrivacyPolicy.routes";
import { NotificationRoutes } from "../modules/Notification/Notification.routes";
import { ReviewRoutes } from "../modules/Review/Review.routes";
import { SubscriptionRoutes } from "../modules/Subscription/Subscription.routes";
import { PlanRoutes } from "../modules/Plan/Plan.routes";
import { CoursesRoutes } from "../modules/Courses/Courses.routes";
import { VideosRoutes } from "../modules/Videos/Videos.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/courses",
    route: CoursesRoutes,
  },
  {
    path: "/videos",
    route: VideosRoutes,
  },
  {
    path: "/subscription",
    route: SubscriptionRoutes,
  },
  {
    path: "/plan",
    route: PlanRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/notifications",
    route: NotificationRoutes,
  },
  {
    path: "/trams",
    route: TermsAndConditionsRoutes,
  },
  {
    path: "/privacy",
    route: PrivacyPolicyRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;