/* Typescript Type "App/Entity/ProjectArticle" */

import ArticleComment from "../../Dexodus/SmiParserBundle/Entity/ArticleComment";

interface ProjectArticle {
   id: number;
   article: {
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
      comments: (ArticleComment)[];
      canReply: boolean;
   } | null;
   favorite: boolean;
}

export default ProjectArticle;
