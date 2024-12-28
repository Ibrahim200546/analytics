/* Typescript Type "Dexodus/SmiParserBundle/Entity/ArticleComment_View" */

interface ArticleComment_View {
   id: number;
   userId: string | null;
   replies: (ArticleComment_View)[];
   commentatorName: string;
   content: string;
   likes: number;
   createdAt: string | null;
   deletedFromSource: boolean;
   tone: "positive" | "negative" | "neutral" | "unknown";
   canReply: boolean;
   isRoot: boolean;
}

export default ArticleComment_View;
