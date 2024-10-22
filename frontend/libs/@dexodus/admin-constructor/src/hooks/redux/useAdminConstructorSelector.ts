import {TypedUseSelectorHook, useSelector} from "react-redux";
import {AdminConstructorState} from "@/libs/@dexodus/admin-constructor/src/store/store";

const useAdminConstructorSelector: TypedUseSelectorHook<AdminConstructorState> = useSelector;

export default useAdminConstructorSelector;
