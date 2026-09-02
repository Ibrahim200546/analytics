import styles from "./page.module.scss";
import LinkButton from "@dexodus/bootstrap/src/UserInterface/LinkButton";
import {ButtonStyle} from "@dexodus/bootstrap/src/UserInterface/Button";

const Page = () => {
    return (
        <div className={styles.page}>
            <div className={styles.loginWindow}>
                Войти в систему

                <div className={styles.loginButtons}>
                    {                    <LinkButton href="/login/jwt" style={ButtonStyle.Default}>Войти используя почту и пароль</LinkButton>
}
                </div>
            </div>
        </div>
    )
}

export default Page;
