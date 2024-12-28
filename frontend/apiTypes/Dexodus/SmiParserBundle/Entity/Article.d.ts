/* Typescript Type "Dexodus/SmiParserBundle/Entity/Article" */

interface Article {
   id: number;
   parser: string;
   source: string;
   originalPath: string;
   imageUrl: string | null;
   image: {
      id: number;
      name: string;
      originalName: string | null;
      extension: string;
      path: string;
      mimeType: string | null;
      savedAt: string;
      isTemp: boolean;
      temporaryUrl: string | null;
   } | null;
   title: string;
   content: string;
   announce: string | null;
   startTracked: string;
   lastUpdate: string;
   createdAt: string;
   comments: ({})[];
   canReply: boolean;
}

export default Article;
