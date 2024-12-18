import {TypedUseSelectorHook, useSelector} from "react-redux";
import {AdminConstructorState} from "../../store/store";

const useAdminConstructorSelector: TypedUseSelectorHook<AdminConstructorState> = useSelector;

export default useAdminConstructorSelector;
