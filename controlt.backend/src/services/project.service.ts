import prisma from "../config/prisma.config.js";
import { Project, Prisma } from "@prisma/client";
import CreateProjectDto from "../dtos/project/createProject.dto.js";
import UpdateProjectDto from "../dtos/project/updateProject.dto.js";
import FilterProjectDto from "../dtos/project/filterProject.dto.js";

class ProjectService {
    /**
     * Cria um novo projeto.
     */
    public async create(data: CreateProjectDto): Promise<Project> {
        return prisma.project.create({
            data: {
                title: data.title,
                description: data.description,
                status_id: Number(data.status_id),
            },
            include: {
                status: true,
                tasks: true
            },
        });
    }

    /**
     * Lista projetos com filtros.
     */
    public async findAll(filters: FilterProjectDto): Promise<Project[]> {
        const { page = 1, limit = 20, title, status_id } = filters;

        const where: Prisma.ProjectWhereInput = {
            ...(title && { title: { contains: title, mode: "insensitive" } }),
            ...(status_id && { status_id: Number(status_id) }),
        };

        return prisma.project.findMany({
            where,
            include: {
                status: true,
                tasks: true
            },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            orderBy: { created_date: "desc" },
        });
    }

    /**
     * Busca um projeto por ID, incluindo suas tarefas.
     */
    public async findById(id: number): Promise<Project> {
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                status: true,
                tasks: {
                    include: {
                        status: true,
                        priority: true,
                        assigned_to: true,
                        created_by: true,
                        item: true,
                    },
                    orderBy: { created_date: 'asc' }
                },
            },
        });

        if (!project) {
            throw new Error("Projeto não encontrado.");
        }
        return project;
    }

    /**
     * Atualiza um projeto.
     */
    public async update(id: number, data: UpdateProjectDto): Promise<Project> {
        await this.findById(id);
        return prisma.project.update({
            where: { id },
            data: data,
            include: {
                status: true,
            },
        });
    }

    /**
     * Deleta um projeto.
     */
    public async delete(id: number): Promise<void> {

        const tasksCount = await prisma.task.count({ where: { project_id: id } });

        if (tasksCount > 0) {
            throw new Error("Não é possível deletar um projeto que contém tarefas. Arquive o projeto ou remova as tarefas primeiro.");
        }

        await prisma.project.delete({ where: { id } });
    }
}

export default new ProjectService();