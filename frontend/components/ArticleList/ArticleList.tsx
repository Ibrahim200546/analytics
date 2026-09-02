"use client";

import React, {useEffect, useState} from "react";
import styles from "./ArticleList.module.scss";
import ArticleAnnounce from "@/components/ArticleAnnounce";
import Button, {ButtonStyle} from "@dexodus/bootstrap/src/UserInterface/Button";
import ButtonsGroup from "@dexodus/bootstrap/src/UserInterface/ButtonsGroup";
import {AiFillStar, AiOutlineStar} from "react-icons/ai";
import {FaSort, FaSortDown, FaSortUp} from "react-icons/fa";
import useForm from "@dexodus/react-form/src/hooks/useForm";
import Field from "@dexodus/react-form/src/fields/Field";
import AsyncDropdownField from "@dexodus/bootstrap/src/UserInterface/Fields/AsyncDropdownField";
import {getCookie, setCookie} from "@dexodus/bootstrap/src/common/cookies";
import {toast} from "react-toastify";
import {useSession} from "next-auth/react";
import Project from "@/apiTypes/App/Entity/Project";
import HydraCollection from "@/types/HydraCollection";
import ProjectArticle from "@/apiTypes/App/Entity/ProjectArticle";
import InfinityContainer from "@dexodus/bootstrap/src/UserInterface/InfinityContainer";
import useApiFetch from "@dexodus/api-fetch/src/hooks/useApiFetch";
import ArticleView from "@/components/ArticleView";

interface ArticleListProps {
    projectArticlesHydraCollection: HydraCollection<ProjectArticle>;
    project?: Project;
    organizationId?: string;
}

const ArticleList: React.FC<ArticleListProps> = ({project, projectArticlesHydraCollection, organizationId}) => {
    const [filters, setFilters] = useState<{
        favorite: boolean,
        createdAt: false | "asc" | "desc",
    }>({
        favorite: false,
        createdAt: 'desc',
    });

    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
    const [firstProjectArticlesHydraCollection, setFirstProjectArticlesHydraCollection] = useState(projectArticlesHydraCollection);
    const {data} = useSession();
    const additionalQueryParameters = organizationId ? {organizationId} : {};
    const apiFetch = useApiFetch();
    const [loading, setLoading] = useState<boolean>(false);

    const {component: projectForm, data: projectFormData} = useForm((
        <Field component={AsyncDropdownField} property="project" label="Выбранный проект" componentProps={{
            url: "/api/projects/for-my-organization",
            label: "name",
            additionalQueryParameters,
        }}/>
    ), {project: project ?? ''});
    const [currentProjectArticle, setCurrentProjectArticle] = useState<ProjectArticle | null>(null);

    useEffect(() => {
        if (projectFormData.project && typeof projectFormData.project === 'string') {
            const projectId = projectFormData.project.split("/").pop() as string;
            if (getCookie(`news-${data?.user?.id}-${organizationId}-project-id`) === projectId) {
                return;
            }

            setCookie(`news-${data?.user?.id}-${organizationId}-project-id`, projectId);
            toast("Проект был успешно изменён", {type: "success"});
            window.location.reload();
        }
    }, [projectFormData]);

    const showMore = (projectArticle: ProjectArticle) => {
        setCurrentProjectArticle(projectArticle);
    }

    const renderHydraCollection = (hydraCollection: HydraCollection<ProjectArticle>): React.ReactNode[] => {
        return hydraCollection['hydra:member'].map(projectArticle => projectArticle.article ? (
            <ArticleAnnounce
                key={projectArticle.id}
                projectArticle={projectArticle}
                article={projectArticle.article}
                viewMore={showMore}
            />
        ) : '');
    }

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }
        (async () => {
            setLoading(true);
            setFirstProjectArticlesHydraCollection(await update());
            setLoading(false);
        })();
    }, [filters]);

    const update = async (page: number = 1): Promise<HydraCollection<ProjectArticle>> => {
        const queryParameters: Record<string, string | number> = {page};

        if (filters.favorite) {
            queryParameters.favorite = '1';
        }

        if (filters.createdAt) {
            queryParameters['order[article.createdAt]'] = filters.createdAt;
        }

        const response = await apiFetch(`/api/project-articles/${project?.id}?${Object.entries(queryParameters).map(([key, value]) => `${key}=${value}`).join('&')}`);
        return await response.json();
    }

    return (
        <div className={styles.articleList}>
            <ArticleView
                organizationId={organizationId}
                projectArticle={currentProjectArticle}
                onHide={() => {
                    setCurrentProjectArticle(null);
                }}
                visible={!!currentProjectArticle}
            />
            <div>
                {projectForm}
            </div>
            <div>
                <ButtonsGroup>
                    <Button
                        style={filters.favorite ? ButtonStyle.Primary : ButtonStyle.Info}
                        icon={filters.favorite ? <AiFillStar/> : <AiOutlineStar/>}
                        onClick={() => {
                            setFilters(filters => ({...filters, favorite: !filters.favorite}));
                        }}
                    >
                        {filters.favorite ? "Скрыть" : "Показать"} избранные
                    </Button>
                    <Button style={filters.createdAt ? ButtonStyle.Primary : ButtonStyle.Info}
                            icon={filters.createdAt ? (filters.createdAt === "asc" ? <FaSortDown/> : <FaSortUp/>) :
                                <FaSort/>} onClick={() => setFilters(filters => ({
                        ...filters,
                        createdAt: !filters.createdAt ? "asc" : (filters.createdAt === "asc" ? "desc" : false),
                    }))}>{!filters.createdAt ? "Без сортировки по дате" : (filters.createdAt === "desc" ? "Сначала новые" : "Сначала старые")}</Button>
                </ButtonsGroup>
            </div>
            <InfinityContainer
                className={styles.infinityContainer}
                loadPage={async (page) => {
                    const hydraCollection = await update(page);
                    const components = renderHydraCollection(hydraCollection);

                    return {
                        components,
                        isFinish: components.length === 0 || hydraCollection["hydra:view"]["@id"] === hydraCollection["hydra:view"]["hydra:last"],
                    };
                }}
                firstPageComponents={loading ? [] : renderHydraCollection(firstProjectArticlesHydraCollection)}
            />
        </div>
    );
};

export default ArticleList;
