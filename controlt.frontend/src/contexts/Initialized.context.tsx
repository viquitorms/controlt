import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
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
    actionableStatusTasks: StatusTask[];
    nonActionableStatusTasks: StatusTask[];
    priorities: PriorityTask[];
    profiles: Profile[];
    statusProjects: StatusProject[];
    loading: boolean;
    loaded: boolean;
    error?: string;
    refresh: () => Promise<void>;
    getStatus: (statusName: string) => StatusTask | undefined;
};

const InitializeContext = createContext<InitializeState | undefined>(undefined);

export function InitializeProvider({
    children,
    autoLoad = true,
}: {
    children: ReactNode;
    autoLoad?: boolean;
}) {
    const [actionableStatusTasks, setActionableStatusTasks] = useState<StatusTask[]>([]);
    const [nonActionableStatusTasks, setNonActionableStatusTasks] = useState<StatusTask[]>([]);
    const [priorities, setPriorities] = useState<PriorityTask[]>([]);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [statusProjects, setStatusProjects] = useState<StatusProject[]>([]);

    const [loading, setLoading] = useState<boolean>(autoLoad);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    // dedupe / inflight promise
    const inflightRef = useRef<Promise<void> | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const loadAll = useCallback(async () => {
        // se já há uma requisição em curso, retorna ela (dedupe)
        if (inflightRef.current) return inflightRef.current;

        // abort anterior (se houver)
        abortRef.current?.abort();
        const ac = new AbortController();
        abortRef.current = ac;

        const p = (async () => {
            setLoading(true);
            setError(undefined);
            try {
                // Se seus services aceitarem signal, passe ac.signal; aqui assumimos que não,
                // mas mantemos AbortController para futura adaptação.
                const [statusTasksRes, prioritiesRes, profilesRes, statusProjectsRes] =
                    await Promise.all([
                        statusTaskService.findAll(),
                        priorityTaskService.findAll(),
                        profileService.list(),
                        statusProjectService.findAll(),
                    ]);

                // se abortado, evitar setState
                if (ac.signal.aborted) return;

                setActionableStatusTasks(statusTasksRes.filter(st => st.is_actionable));
                setNonActionableStatusTasks(statusTasksRes.filter(st => !st.is_actionable));
                setPriorities(prioritiesRes);
                setProfiles(profilesRes);
                setStatusProjects(statusProjectsRes);
                setLoaded(true);
            } catch (err: any) {
                if (ac.signal.aborted) {
                    // abortado — não setar erro
                    // console.debug("Initialize load aborted");
                } else {
                    console.error("Erro ao carregar listas de referência:", err);
                    setError(err?.message ?? "Erro ao carregar listas");
                }
            } finally {
                if (!ac.signal.aborted) setLoading(false);
                inflightRef.current = null;
                abortRef.current = null;
            }
        })();

        inflightRef.current = p;
        return p;
    }, []);

    useEffect(() => {
        if (!autoLoad) return;
        void loadAll();
        return () => {
            abortRef.current?.abort();
        };
    }, [autoLoad, loadAll]);

    const refresh = useCallback(async () => {
        await loadAll();
    }, [loadAll]);

    /**
     * Retorna o ID do StatusTask com base no StatusTask fornecido
     */
    const getStatus = useCallback((statusName: string) => {
        return actionableStatusTasks.find((s) => s.name === statusName) ??
            nonActionableStatusTasks.find((s) => s.name === statusName);
    }, [actionableStatusTasks, nonActionableStatusTasks]);

    const value = useMemo(
        () => ({
            actionableStatusTasks,
            nonActionableStatusTasks,
            priorities,
            profiles,
            statusProjects,
            loading,
            loaded,
            error,
            refresh,
            getStatus,
        }),
        [actionableStatusTasks, nonActionableStatusTasks, priorities, profiles, statusProjects, loading, loaded, error, refresh, getStatus]
    );

    return <InitializeContext.Provider value={value}>{children}</InitializeContext.Provider>;
}

export function useInitialize() {
    const ctx = useContext(InitializeContext);
    if (!ctx) throw new Error("useInitialize must be used inside InitializeProvider");
    return ctx;
}