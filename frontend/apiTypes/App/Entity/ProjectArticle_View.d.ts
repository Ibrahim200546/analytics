/* Typescript Type "App/Entity/ProjectArticle_View" */

import ArticleComment_View from "../../Dexodus/SmiParserBundle/Entity/ArticleComment_View";

interface ProjectArticle_View {
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
      comments: (ArticleComment_View)[];
      canReply: boolean;
   } | null;
   favorite: boolean;
}

export default ProjectArticle_View;
