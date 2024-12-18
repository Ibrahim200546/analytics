/* Typescript Type "App/Entity/User" */

interface User {
   email: string;
   roles: ("ROLE_ADMIN" | "ROLE_USER" | "ROLE_SUPERVISOR" | "ROLE_EMPLOYEE")[];
   firstName: string;
   lastName: string;
   patronymic: string;
   iin: string;
   id: number;
}

export default User;
