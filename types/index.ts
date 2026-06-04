export type UserRole =
 | "Admin"
 | "Faculty"
 | "Student"
 | "Guest";

export interface AppUser {
 id:string;
 email:string;
 role:UserRole;
}
