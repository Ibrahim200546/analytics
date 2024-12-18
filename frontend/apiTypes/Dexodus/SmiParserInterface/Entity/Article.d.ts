/* Typescript Type "Dexodus/SmiParserInterface/Entity/Article" */

interface Article {
   id: number;
   parser: string;
   source: string;
   originalPath: string;
   imageUrl: string | null;
   title: string;
   content: string;
   announce: string | null;
   startTracked: string;
   lastUpdate: string;
   createdAt: string;
}

export default Article;
