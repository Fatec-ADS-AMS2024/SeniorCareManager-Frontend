import { UserType } from "../enums/UserType";
import { UserStatus } from "../enums/UserStatus";

export default interface User {
  id: number;
  email: string;
  password:string;
  userType: UserType;
  userStatus: UserStatus;
}
