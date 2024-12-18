/* Typescript Type "App/Entity/Subscription" */

interface Subscription {
   id: number;
   type: "general" | "demo";
   start: string;
   end: string;
   active: boolean;
   price: number | null;
   priceForProjectImprovements: number | null;
}

export default Subscription;
