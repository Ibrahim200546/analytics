"use client";

import React, {useEffect, useState} from "react";
import styles from "./ArticleView.module.scss";
import ProjectArticle from "@/apiTypes/App/Entity/ProjectArticle";
import useModal from "@dexodus/bootstrap/src/UserInterface/Modal/useModal";
import {ModalSize} from "@dexodus/bootstrap/src/UserInterface/Modal/Modal";
import {Button} from "reactstrap";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";
import ProjectArticleView from "@/apiTypes/App/Dto/ProjectArticleView";
import HtmlView from "@dexodus/bootstrap/src/UserInterface/HtmlView";
import ArticleComment from "@/components/ArticleComment";
import ArticleImage from "@/components/ArticleImage";

interface ArticleViewProps {
    projectArticle: ProjectArticle | null;
    onHide: () => void;
    visible: boolean;
    organizationId?: string;
}

type LoadedProjectArticleViews = {[projectArticleId: number]: ProjectArticleView | "loading" | "failed"};

const ArticleView: React.FC<ArticleViewProps> = ({projectArticle, onHide, visible, organizationId}) => {
    const apiFetch = useApiFetch();
    const [loadedProjectArticleViews, setLoadedProjectArticleViews] = useState<LoadedProjectArticleViews>({})

    const loadProjectArticle = (projectArticle: ProjectArticle, useCached: boolean = true) => {
        if (!useCached || (projectArticle?.id && !(projectArticle.id in loadedProjectArticleViews) && !loadedProjectArticleViews[projectArticle.id])) {
            loadedProjectArticleViews[projectArticle.id] = "loading";
            setLoadedProjectArticleViews(loadedProjectArticleViews => ({...loadedProjectArticleViews, [projectArticle.id]: "loading"} as LoadedProjectArticleViews));

            (async () => {
                const response = await apiFetch(`/api/project-articles/view/${projectArticle.id}`);

                if (!response.ok) {
                    setLoadedProjectArticleViews(loadedProjectArticleViews => ({...loadedProjectArticleViews, [projectArticle.id]: "failed"} as LoadedProjectArticleViews));
                    return;
                }

                const projectArticleView = await response.json();
                setLoadedProjectArticleViews(loadedProjectArticleViews => ({...loadedProjectArticleViews, [projectArticle.id]: projectArticleView} as LoadedProjectArticleViews));
            })().then();
        }
    }

    useEffect(() => {
        if (projectArticle) {
            loadProjectArticle(projectArticle);
        }
    }, [projectArticle]);

    const projectArticleView = loadedProjectArticleViews[projectArticle?.id ?? -1] ?? 'loading';

    const {modal: articleModal, setVisible: setArticleModalVisible} = useModal((
        <div className={styles.articleViewContent}>
            <div className={styles.articleViewAnnounce}>
                <ArticleImage className={styles.image} imageUrl={projectArticle?.article?.imageUrl ?? ''}/>
                {projectArticle?.article?.announce}
            </div>
            {projectArticleView === 'loading' && (
                <div className="secondary-color">Загрузка...</div>
            )}
            {projectArticleView === 'failed' && (
                <div className="secondary-color">Не удалось загрузить новость полностью</div>
            )}
            {typeof projectArticleView !== 'string' && (
                <div>
                    <HtmlView html={projectArticleView.projectArticle.article?.content}/>
                    <div>
                        <p className={styles.commentsTitle}>{projectArticleView.projectArticle.article?.comments?.length ? 'Комментарии:' : 'Никто еще не оставил комментариев'}</p>
                        {(projectArticleView.projectArticle.article?.comments ?? []).filter(comment => comment.isRoot).map(comment => (
                            <ArticleComment key={comment.id} articleComment={comment} organizationId={organizationId} reloadProjectArticle={() => projectArticle && loadProjectArticle(projectArticle, false)}/>
                        ))}
                    </div>
                </div>
            )}
        </div>
    ), (
        <div className={styles.articleViewTitle}>
            <h2>{projectArticle?.article?.title}</h2>
        </div>
    ), ({close}) => (
        <div className={styles.articleViewControls}>
            <div>
                {typeof projectArticleView !== 'string' && (
                    <a className={styles.source} href={projectArticleView.sourceLink} target="_blank">
                        <>
                            <img src={projectArticleView.sourceFavicon} alt={projectArticleView.sourceName} className={styles.sourceFavicon}/>
                            <span className={styles.sourceName}>{projectArticleView.sourceName}</span>
                        </>
                    </a>
                )}
            </div>
            <Button onClick={close}>Закрыть</Button>
        </div>
    ), ModalSize.Large, () => onHide());

    useEffect(() => {
        setArticleModalVisible(visible);
    }, [visible]);

    return articleModal;
};

export default ArticleView;
