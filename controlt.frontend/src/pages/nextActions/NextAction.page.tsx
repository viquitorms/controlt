import { EnumActionableType, EnumActionableTypeName } from "../../enums/ActionableType.enum";
import TasksPage from "../tasks/Tasks.page";

export default function NextActions() {
    return <TasksPage statusName={EnumActionableTypeName[EnumActionableType.ProximaAcao]} />;
}