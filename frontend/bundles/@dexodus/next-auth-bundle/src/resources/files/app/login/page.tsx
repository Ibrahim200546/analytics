import styles from "./page.module.scss";
import Button, {ButtonStyle} from "@dexodus/bootstrap/src/UserInterface/Button";
import LinkButton from "@dexodus/bootstrap/src/UserInterface/LinkButton";

const Page = () => {
    return (
        <div className={styles.page}>
            <div className={styles.loginWindow}>
                Войти в систему

                <div className={styles.loginButtons}>
                    {/*>jsel
                        foreach (parameters["@dexodus.next-auth.providers"] as providerName => provider) {
                            writeln("                    ", provider.button);
                        }
                    */}
                </div>
            </div>
        </div>
    )
}

export default Page;
