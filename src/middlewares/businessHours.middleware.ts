import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { BUSINESS_HOURS, UserRole } from "../config/constants";

export function isWithinBusinessHours(date: Date): boolean {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_HOURS.timezone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value || "";

  const weekday = getPart("weekday").toLowerCase();
  const hour = parseInt(getPart("hour"), 10);
  const minute = parseInt(getPart("minute"), 10);
  const currentMinutes = hour * 60 + minute;

  if (weekday === "sun") {
    return false;
  }

  const { weekdays, saturday } = BUSINESS_HOURS;

  if (weekday === "sat") {
    const start = saturday.startHour * 60 + saturday.startMinute;
    const end = saturday.endHour * 60 + saturday.endMinute;
    return currentMinutes >= start && currentMinutes < end;
  }

  const start = weekdays.startHour * 60 + weekdays.startMinute;
  const end = weekdays.endHour * 60 + weekdays.endMinute;
  return currentMinutes >= start && currentMinutes < end;
}

export function businessHoursMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as AuthRequest).user;

  if (user && user.role === UserRole.ADMIN) {
    return next();
  }

  const now = new Date();

  if (!isWithinBusinessHours(now)) {
    res.status(403).json({ message: BUSINESS_HOURS.blockedMessage });
    return;
  }

  next();
}
