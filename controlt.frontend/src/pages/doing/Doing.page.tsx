import { EnumActionableType, EnumActionableTypeName } from "../../enums/ActionableType.enum";
import TasksPage from "../tasks/Tasks.page";

export default function Doing() {
    return <TasksPage statusName={EnumActionableTypeName[EnumActionableType.EmAndamento]} />;
}