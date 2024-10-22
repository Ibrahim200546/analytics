import {useDispatch} from "react-redux";
import {AdminConstructorDispatch} from "@/libs/@dexodus/admin-constructor/src/store/store";

const useAdminConstructorDispatch = () => useDispatch<AdminConstructorDispatch>();

export default useAdminConstructorDispatch;
