import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

/**
 * validateDto(DTOClass, { validationOptions, source })
 * - DTOClass: classe DTO com decorators do class-validator.
 * - validationOptions: opções passadas para validate().
 * - source: 'auto' (padrão) | 'body' | 'query' | 'params'
 *
 * Com 'auto': para GET/DELETE/HEAD tenta validar req.query (ou req.params se query vazio),
 * para outros métodos usa req.body.
 */
export function validateDto(DTOClass, { validationOptions = {}, source = "auto" } = {}) {
    if (!DTOClass) {
        throw new Error("validateDto middleware requires a DTO class as the first argument.");
    }

    return async (req, res, next) => {
        try {
            // decide de onde virão os dados
            let data;
            const method = (req.method || "").toUpperCase();

            if (source === "auto") {
                if (["GET", "DELETE", "HEAD"].includes(method)) {
                    data = Object.keys(req.query || {}).length ? req.query : req.params;
                } else {
                    data = req.body;
                }
            } else if (source === "body") {
                data = req.body;
            } else if (source === "query") {
                data = req.query;
            } else if (source === "params") {
                data = req.params;
            } else {
                return res.status(500).json({ error: "validateDto: invalid source option" });
            }

            // Se não houver dados
            if (data == null || (typeof data === "object" && Object.keys(data).length === 0)) {
                // Se for GET/DELETE/HEAD e não houver dados, apenas segue (não é obrigatório ter corpo em GET)
                if (["GET", "DELETE", "HEAD"].includes(method)) {
                    return next();
                }

                return res.status(400).json({
                    error: "Request body is missing or empty. Ensure express.json() is enabled or configure source to 'query'/'params'."
                });
            }

            // Converte e valida
            const dtoInstance = plainToInstance(DTOClass, data);
            if (dtoInstance == null) {
                return res.status(400).json({ error: "Failed to create DTO instance. Check DTO class and request data." });
            }

            const errors = await validate(dtoInstance, validationOptions);

            if (errors.length > 0) {
                const messages = errors.flatMap(err => (err.constraints ? Object.values(err.constraints) : []));
                return res.status(400).json({ error: "Validation failed", messages });
            }

            // Sobrescreve a fonte apropriada com a instância validada (útil para o controller receber tipos)
            if (source === "query") req.query = dtoInstance;
            else if (source === "params") req.params = dtoInstance;
            else req.body = dtoInstance;

            return next();
        } catch (err) {
            return next(err);
        }
    };
}