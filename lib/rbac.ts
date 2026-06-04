import { UserRole } from "@/types";

export function canViewFile(
 role:UserRole,
 owner:string,
 current:string
){

 if(role==="Admin")
    return true;

 if(owner===current)
    return true;

 return false;
}