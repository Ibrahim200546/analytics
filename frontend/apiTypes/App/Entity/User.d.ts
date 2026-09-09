/* Typescript Type "App/Entity/User" */

interface User {
   email: string;
   roles: ("ROLE_ADMIN" | "ROLE_USER" | "ROLE_SUPERVISOR" | "ROLE_EMPLOYEE")[];
   firstName: string;
   lastName: string;
   patronymic: string;
   iin: string;
   // Symfony used a numeric ID; Supabase Auth uses UUID strings.
   id: number | string;
}

export default User;
