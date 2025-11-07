import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useMemo,
    type ReactNode,
} from "react";

import { statusTaskService } from "../services/statusTask.service";
import { priorityTaskService } from "../services/priorityTask.service";
import { profileService } from "../services/profile.service";
import { statusProjectService } from "../services/statusProject.service";

import type { StatusTask } from "../dtos/statusTask/statusTask.res.dto.tsx";
import type { PriorityTask } from "../dtos/priorityTask/priorityTask.res.dto.tsx";
import type { Profile } from "../dtos/profile/profile.res.dto.tsx";
import type { StatusProject } from "../dtos/statusProject/statusProject.res.dto.tsx";

type InitializeState = {
    statusTasks: StatusTask[];
    priorities: PriorityTask[];
    profiles: Profile[];
    statusProjects: StatusProject[];
    loading: boolean;
    error?: string;
    refresh: () => Promise<void>;
};

const InitializeContext = createContext<InitializeState | undefined>(undefined);

export function InitializeProvider({
    children,
    autoLoad = true,
}: {
    children: ReactNode;
    autoLoad?: boolean;
}) {
    const [statusTasks, setStatusTasks] = useState<StatusTask[]>([]);
    const [priorities, setPriorities] = useState<PriorityTask[]>([]);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [statusProjects, setStatusProjects] = useState<StatusProject[]>([]);

    const [loading, setLoading] = useState<boolean>(autoLoad);
    const [error, setError] = useState<string | undefined>(undefined);

    const loadAll = useCallback(async () => {
        setLoading(true);
        setError(undefined);
        try {
            const [
                statusTasksRes,
                prioritiesRes,
                profilesRes,
                statusProjectsRes,
            ] = await Promise.all([
                statusTaskService.findAll(),
                priorityTaskService.findAll(),
                profileService.list(),
                statusProjectService.findAll(),
            ]);

            setStatusTasks(statusTasksRes);
            setPriorities(prioritiesRes);
            setProfiles(profilesRes);
            setStatusProjects(statusProjectsRes);
        } catch (err: any) {
            console.error("Erro ao carregar listas de referência:", err);
            setError(err?.message ?? "Erro ao carregar listas");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!autoLoad) return;
        loadAll();
    }, [autoLoad, loadAll]);

    const refresh = useCallback(async () => {
        await loadAll();
    }, [loadAll]);

    const value = useMemo(
        () => ({
            statusTasks,
            priorities,
            profiles,
            statusProjects,
            loading,
            error,
            refresh,
        }),
        [statusTasks, priorities, profiles, statusProjects, loading, error, refresh]
    );

    return <InitializeContext.Provider value={value}>{children}</InitializeContext.Provider>;
}

export function useInitialize() {
    const ctx = useContext(InitializeContext);
    if (!ctx) throw new Error("useInitialize must be used inside InitializeProvider");
    return ctx;
}