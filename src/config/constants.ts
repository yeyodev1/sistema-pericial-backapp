export enum UserRole {
  ADMIN = "ADMIN",
  OPERATOR = "OPERATOR",
  COLLECTOR = "COLLECTOR",
  PERITO = "PERITO",
}

export const BUSINESS_HOURS = {
  timezone: "America/Guayaquil",
  weekdays: {
    startHour: 5,
    startMinute: 0,
    endHour: 20,
    endMinute: 0,
  },
  saturday: {
    startHour: 5,
    startMinute: 0,
    endHour: 14,
    endMinute: 0,
  },
  blockedMessage:
    "El acceso está restringido fuera del horario comercial. La plataforma se reactivará a las 5:00 AM.",
};
