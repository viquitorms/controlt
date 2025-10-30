import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export function validateDto(dtoClass) {
    return async (req, res, next) => {
        // Converte o corpo da requisição (JSON) para uma instância da classe DTO
        const dtoInstance = plainToInstance(dtoClass, req.body);

        // Valida a instância com base nos decorators (@IsString, @IsInt, etc.)
        const errors = await validate(dtoInstance);

        // Se houver erros, retorna uma resposta 400 com os detalhes
        if (errors.length > 0) {
            const messages = errors.map((err) => Object.values(err.constraints || {})).flat();
            return res.status(400).json({ error: "Validation failed", messages });
        }

        // Se a validação passar, substitui o req.body pela instância validada e continua
        req.body = dtoInstance;
        next();
    };
}