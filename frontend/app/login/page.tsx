import styles from "./page.module.scss";
import Link from "next/link";
import {FiActivity, FiArrowUpRight, FiShield} from "react-icons/fi";

const Page = () => {
    return (
        <main className={styles.page}>
            <div className={styles.shell}>
                <section className={styles.introduction} aria-labelledby="login-title">
                    <div className={styles.brand}>ISMI <span>Control Room</span></div>
                    <p className={styles.eyebrow}>Мониторинг информационного поля</p>
                    <h1 id="login-title">Рабочее пространство аналитики</h1>
                    <p className={styles.description}>Следите за повесткой, источниками и динамикой данных в одном защищённом кабинете.</p>
                    <div className={styles.status}>
                        <FiActivity aria-hidden="true"/>
                        <span>Система доступна для авторизованных пользователей</span>
                    </div>
                </section>
                <section className={styles.accessPanel} aria-labelledby="access-title">
                    <div className={styles.panelIcon}><FiShield aria-hidden="true"/></div>
                    <p className={styles.panelEyebrow}>Авторизация</p>
                    <h2 id="access-title">Продолжить работу</h2>
                    <p className={styles.panelDescription}>Войдите с корпоративными данными доступа.</p>
                    <Link className={styles.loginLink} href="/login/jwt">
                        <span>Войти по логину и паролю</span>
                        <FiArrowUpRight aria-hidden="true"/>
                    </Link>
                    <p className={styles.notice}>Доступ к данным предоставляется в соответствии с вашей ролью.</p>
                </section>
            </div>
        </main>
    )
}

export default Page;
