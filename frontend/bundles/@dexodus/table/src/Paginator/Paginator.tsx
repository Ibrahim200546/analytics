import styles from "./Paginator.module.scss";
import classnames from "classnames";

const MAX_DISPLAY_PAGES_IN_PAGINATOR = 5;

if (MAX_DISPLAY_PAGES_IN_PAGINATOR % 2 === 0) {
    throw new Error('Constant "MAX_DISPLAY_PAGES_IN_PAGINATOR" must be odd')
}

interface PaginatorProps {
    countPages: number;
    currentPage: number;
    setCurrentPage: (pageNumber: number) => void;
}

interface Page {
    number: number;
    active: boolean;
}

const makePages = (countPages: number, currentPage: number): Page[] => {
    if (countPages === 0) {
        return [];
    }

    const countPagesInOneSide = Math.floor(MAX_DISPLAY_PAGES_IN_PAGINATOR / 2);

    const pages = [];

    for (let i = currentPage - countPagesInOneSide * 2; i <= currentPage + countPagesInOneSide * 2; i++) {
        pages.push({
            number: i,
            active: i === currentPage,
        } as Page);
    }

    const filteredPages = pages.filter(page => page.number >= 1 && page.number <= countPages);
    const firstPageNumber = filteredPages[0].number;
    const lastPageNumber = filteredPages[filteredPages.length - 1].number;

    const rightSideInfluence = Math.max(countPagesInOneSide - lastPageNumber + currentPage, 0);
    const startSplicing = currentPage - firstPageNumber - countPagesInOneSide - rightSideInfluence;

    return filteredPages.splice(Math.max(0, startSplicing), MAX_DISPLAY_PAGES_IN_PAGINATOR);
}

const Paginator = ({countPages, currentPage, setCurrentPage}: PaginatorProps) => {
    const pages = makePages(countPages, currentPage);

    const changePage = (page: Page) => {
        setCurrentPage(page.number);
    }

    return (
        <div className={styles.paginator}>
            {pages.map(page => (
                <span
                    className={classnames(styles.page, page.active ? styles.active : '')}
                    onClick={() => changePage(page)}
                    key={page.number}
                >
                    {page.number}
                </span>
            ))}
        </div>
    )
}

export default Paginator;
