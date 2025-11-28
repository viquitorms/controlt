import metricService from "../services/metric.service.js";

class MetricController {
    /**
     * Busca o Lead Time
     * GET /api/metrics/lead-time
     */
    static async getLeadTime(req, res) {
        try {
            const userId = req.user.id;
            const filters = req.query;

            const metrics = await metricService.getLeadTime(userId, filters);

            res.status(200).json(metrics);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Busca a Taxa de Conclusão
     * GET /api/metrics/conclusion-rate
     */
    static async getConclusionRate(req, res) {
        try {
            const userId = req.user.id;
            const filters = req.query;

            const metrics = await metricService.getConclusionRate(userId, filters);

            res.status(200).json(metrics);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default MetricController;