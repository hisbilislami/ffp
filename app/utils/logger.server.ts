// import { ActivityLog } from "@prisma/client";
//
// import { prisma } from "./db.server";
//
// export const logUserActivity = async (
//   payload: Pick<ActivityLog, "tenant_id" | "ip_address" | "user_id">,
//   action: string
// ) => {
//   await prisma.activityLog.create({
//     data: { ...payload, action },
//   });
//
//   console.info(
//     `Recording ${action.toUpperCase()} activity of User with ID ${
//       payload.user_id
//     }`
//   );
// };
