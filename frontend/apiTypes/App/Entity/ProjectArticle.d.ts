/* Typescript Type "App/Entity/ProjectArticle" */

import Article from "../../Dexodus/SmiParserInterface/Entity/Article";

interface ProjectArticle {
   id: number;
   article: Article | null;
   favorite: boolean;
}

export default ProjectArticle;
