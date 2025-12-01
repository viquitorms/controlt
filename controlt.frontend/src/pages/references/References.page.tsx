import { EnumNonActionableType, EnumNonActionableTypeName } from "../../enums/NonActionableType.enum";
import TasksPage from "../tasks/Tasks.page";

export default function References() {
    return <TasksPage statusName={EnumNonActionableTypeName[EnumNonActionableType.Referencia]} />;
}