/* Typescript Type "App/Dto/ProjectArticleView" */

import ArticleComment_View from "../../Dexodus/SmiParserBundle/Entity/ArticleComment_View";

interface ProjectArticleView {
   sourceFavicon: string;
   sourceName: string;
   projectArticle: {
      id: number;
      article: {
         id: number;
         parser: string;
         source: string;
         originalPath: string;
         imageUrl: string | null;
         image: {} | null;
         title: string;
         content: string;
         announce: string | null;
         startTracked: string;
         lastUpdate: string;
         createdAt: string;
         comments: (ArticleComment_View)[];
         canReply: boolean;
      } | null;
      favorite: boolean;
   };
   sourceLink: string;
}

export default ProjectArticleView;
