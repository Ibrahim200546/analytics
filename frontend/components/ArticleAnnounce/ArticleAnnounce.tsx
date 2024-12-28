"use client";

import React, {useState} from "react";
import styles from "./ArticleAnnounce.module.scss";
import Reaction, {ReactionTypeEnum} from "../Reaction/Reaction";
import Link from "next/link";
import {AiFillStar, AiOutlineStar} from "react-icons/ai";
import {BiDotsHorizontalRounded} from "react-icons/bi";
import Article from "@/apiTypes/Dexodus/SmiParserBundle/Entity/Article";
import classnames from "classnames";
import {toast} from "react-toastify";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";
import ProjectArticle from "@/apiTypes/App/Entity/ProjectArticle";
import moment from "moment";
import "moment/locale/ru";
import ArticleComment from "@/apiTypes/Dexodus/SmiParserBundle/Entity/ArticleComment";
import ArticleImage from "@/components/ArticleImage";

interface ArticleAnnounceProps {
    projectArticle: ProjectArticle;
    article: Article;
    viewMore: (projectArticle: ProjectArticle) => void;
}

interface Tones {
    positive: number;
    neutral: number;
    negative: number;
    unknown: number;
}

const ArticleAnnounce: React.FC<ArticleAnnounceProps> = ({projectArticle, article, viewMore}) => {
    const [favoriteChangeLoading, setFavoriteChangeLoading] = useState<boolean>(false);
    const [articleFavorite, setArticleFavorite] = useState(projectArticle.favorite);
    const apiFetch = useApiFetch();

    const tones: Tones = article.comments.reduce((acc: Tones, comment: ArticleComment) => ({...acc, [comment.tone]: acc[comment.tone] + 1}), {positive: 0, neutral: 0, negative: 0, unknown: 0}) as Tones;
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
            <ArticleImage imageUrl={article.imageUrl ?? ''} className={styles.image}/>
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
                            {tones.positive}
                        </div>
                        <div className={styles.reaction}>
                            <Reaction type={ReactionTypeEnum.NEUTRAL} size={34}/>
                            {tones.neutral}
                        </div>
                        <div className={styles.reaction}>
                            <Reaction type={ReactionTypeEnum.NEGATIVE} size={34}/>
                            {tones.negative}
                        </div>
                        <div className={styles.reaction}>
                            <Reaction type={ReactionTypeEnum.UNKNOWN} size={34}/>
                            {tones.unknown}
                        </div>
                    </div>
                    <span className={styles.readMore} onClick={() => viewMore(projectArticle)}>Читать полностью</span>
                </div>
            </div>
        </div>
    );
};

export default ArticleAnnounce;
