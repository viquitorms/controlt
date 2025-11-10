import priorityTaskService from "../services/priorityTask.service";

class PriorityTaskController {
    static async create(req, res) {
        try {
            const priorityTask = await priorityTaskService.create(req.body);
            return res.status(201).json(priorityTask);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    static async findAll(req, res) {
        try {
            const priorityTasks = await priorityTaskService.findAll();
            return res.status(200).json(priorityTasks);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

export default PriorityTaskController;