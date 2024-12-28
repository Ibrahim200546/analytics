/* Typescript Type "Dexodus/SmiParserBundle/Entity/ArticleComment" */

interface ArticleComment {
   id: number;
   tone: "positive" | "negative" | "neutral" | "unknown";
   canReply: boolean;
   isRoot: boolean;
}

export default ArticleComment;
