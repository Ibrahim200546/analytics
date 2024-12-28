/* Typescript Type "App/Entity/Organization" */

interface Organization {
   id: number;
   city: {
      id: number;
      district: {
         id: number;
         region: {
            id: number;
            name: string;
         } | null;
         name: string;
      } | null;
      name: string;
   } | null;
   name: string;
   bin: string;
   subscription: Subscription | null;
   supervisor: User | null;
   limitEmployees: number;
   limitProjects: number;
   createdAt: string;
}

export default Organization;
