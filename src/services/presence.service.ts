import { userService } from "./user.service";

export const presenceService = {
  getStatus: userService.getStatus,
};
