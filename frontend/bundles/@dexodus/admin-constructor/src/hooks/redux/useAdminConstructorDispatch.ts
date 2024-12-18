import {useDispatch} from "react-redux";
import {AdminConstructorDispatch} from "../../store/store";

const useAdminConstructorDispatch = () => useDispatch<AdminConstructorDispatch>();

export default useAdminConstructorDispatch;
