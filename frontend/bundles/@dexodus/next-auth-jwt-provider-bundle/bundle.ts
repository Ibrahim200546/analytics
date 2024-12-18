import {Container} from "@/bundler";

export const init = (container: Container) => {
    container.parameters["@dexodus.next-auth.providers"]["jwtProvider"] = {
        path: "@dexodus/next-auth-jwt-provider-bundle/src/resources/auth/jwtProvider",
        button: "<LinkButton href=\"/login/jwt\" style={ButtonStyle.Default}>Войти используя почту и пароль</LinkButton>"
    };
};
