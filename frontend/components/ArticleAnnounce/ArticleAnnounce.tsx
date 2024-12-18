"use client";

import React, {useState} from "react";
import styles from "./ArticleAnnounce.module.scss";
import Reaction, {ReactionTypeEnum} from "../Reaction/Reaction";
import Link from "next/link";
import {AiFillStar, AiOutlineStar} from "react-icons/ai";
import {BiDotsHorizontalRounded} from "react-icons/bi";
import Article from "@/apiTypes/Dexodus/SmiParserInterface/Entity/Article";
import classnames from "classnames";
import {toast} from "react-toastify";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";
import ProjectArticle from "@/apiTypes/App/Entity/ProjectArticle";
import moment from "moment";
import "moment/locale/ru";

interface ArticleAnnounceProps {
    projectArticle: ProjectArticle;
    article: Article;
}

const ArticleAnnounce: React.FC<ArticleAnnounceProps> = ({projectArticle, article}) => {
    const [favoriteChangeLoading, setFavoriteChangeLoading] = useState<boolean>(false);
    const [articleFavorite, setArticleFavorite] = useState(projectArticle.favorite);
    const apiFetch = useApiFetch();

    const toggleFavorite = async () => {
        if (favoriteChangeLoading) {
            return;
        }

        setFavoriteChangeLoading(true);
        const toggleArticleFavoriteResponse = await apiFetch(`/api/project_articles/${projectArticle.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                favorite: !articleFavorite,
            }),
            headers: {
                'Content-Type': 'application/merge-patch+json',
            }
        });

        if (toggleArticleFavoriteResponse.ok) {
            setArticleFavorite(!articleFavorite);
            toast(articleFavorite ? "Новость была убрана из избранных" : "Новость была добавлена в избранные", {type: 'success'});
        } else {
            toast(articleFavorite ? "Не удалось убрать новость из избранных" : "Не удалось добавить новость в избранные", {type: 'error'});
        }

        setFavoriteChangeLoading(false);
    }

    return (
        <div className={styles.article}>
            <img className={styles.image} src={article.imageUrl ?? ''} alt=""/>
            <div className={styles.content}>
                <div className={styles.topContainer}>
                    <div className={styles.header}>
                        <div>
                            <h2 className={styles.title}>{article.title}</h2>
                            <span className={styles.createdAt}>{article.createdAt ? moment(article.createdAt).format('DD MMMM YYYY | HH:II') : ''}</span>
                        </div>
                        <div className={styles.controls}>
                            <div className={classnames(styles.control, styles.favoriteControl, articleFavorite ? styles.favorite : '')} onClick={toggleFavorite}>
                                <AiFillStar/>
                                <AiOutlineStar/>
                            </div>
                            <div className={styles.control}>
                                <BiDotsHorizontalRounded/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.main}>
                        {article.announce}
                    </div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.reactions}>
                        <div className={styles.reaction}>
                            <Reaction type={ReactionTypeEnum.POSITIVE} size={34}/>
                            {1}
                        </div>
                        <div className={styles.reaction}>
                            <Reaction type={ReactionTypeEnum.NEUTRAL} size={34}/>
                            {2}
                        </div>
                        <div className={styles.reaction}>
                            <Reaction type={ReactionTypeEnum.NEGATIVE} size={34}/>
                            {3}
                        </div>
                        <div className={styles.reaction}>
                            <Reaction type={ReactionTypeEnum.UNKNOWN} size={34}/>
                            {4}
                        </div>
                    </div>
                    <Link href={article.originalPath} target="_blank" className={styles.readMore}>Читать полностью</Link>
                </div>
            </div>
        </div>
    );
};

export default ArticleAnnounce;
