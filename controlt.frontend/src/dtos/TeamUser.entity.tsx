import type { Team } from "./Team.entity";
import type { User } from "./user/User.res.dto";

export interface TeamUser {
    user_id: number;
    team_id: number;

    user?: User;
    team?: Team;
}