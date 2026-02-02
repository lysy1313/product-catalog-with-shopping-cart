import type { RootState } from "@/app/providers/store/store";
import { useSelector } from "react-redux";

export const useAppSelector = useSelector.withTypes<RootState>();
