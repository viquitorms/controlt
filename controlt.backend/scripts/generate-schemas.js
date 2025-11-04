import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dtosPath = path.join(__dirname, '../src/dtos');
const outputPath = path.join(__dirname, '../src/config/swagger/swagger-dtos.js');

function parseDTO(content) {
    const schema = {};
    const lines = content.split('\n');

    lines.forEach(line => {
        const cleanLine = line.replace(/@\w+\(.*?\)/g, '').replace(/\/\/.*$/g, '').trim();
        const propMatch = cleanLine.match(/^(\w+)\??:\s*(string|number|boolean|Date|any)(\[\])?/);

        if (propMatch) {
            const [, propName, propType, isArray] = propMatch;

            let value;
            switch (propType) {
                case 'string':
                    value = 'exemplo';
                    break;
                case 'number':
                    value = 1;
                    break;
                case 'boolean':
                    value = true;
                    break;
                case 'Date':
                    value = '2024-01-01T00:00:00.000Z';
                    break;
                default:
                    value = 'string';
            }

            schema[propName] = isArray ? [value] : value;
        }
    });

    return schema;
}

function getAllDtoFiles(dir, fileList = []) {
    const files = readdirSync(dir, { withFileTypes: true });

    files.forEach(file => {
        const fullPath = path.join(dir, file.name);

        if (file.isDirectory()) {
            getAllDtoFiles(fullPath, fileList);
        } else if ((file.name.endsWith('.dto.ts') || file.name.endsWith('.dto.js')) && !file.name.includes('.spec.')) {
            fileList.push(fullPath);
        }
    });

    return fileList;
}

function generateSchemas() {
    const schemas = {};

    try {
        if (!existsSync(dtosPath)) {
            console.log('⚠️  Pasta de DTOs não encontrada:', dtosPath);
            console.log('📁 Criando arquivo vazio de schemas...');

            const output = `export const dtoSchemas = {};\n`;
            writeFileSync(outputPath, output);
            return;
        }

        const dtoFiles = getAllDtoFiles(dtosPath);

        console.log(`🔍 Encontrados ${dtoFiles.length} arquivos DTO`);

        dtoFiles.forEach(filePath => {
            const content = readFileSync(filePath, 'utf-8');
            const fileName = path.basename(filePath);

            // Gera o nome do schema: login.dto.ts -> Login
            const schemaName = fileName
                .replace('.dto.ts', '')
                .replace('.dto.js', '')
                .split('-')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join('');

            const parsedSchema = parseDTO(content);

            if (Object.keys(parsedSchema).length > 0) {
                schemas[schemaName] = parsedSchema;
                console.log(`   ✓ ${schemaName}`);
            }
        });

        const output = `export const dtoSchemas = ${JSON.stringify(schemas, null, 2)};\n`;
        writeFileSync(outputPath, output);

        console.log('\n✅ Schemas gerados com sucesso!');
        console.log(`Total: ${Object.keys(schemas).length} schemas`);
    } catch (error) {
        console.error('❌ Erro ao gerar schemas:', error.message);
        process.exit(1);
    }
}

generateSchemas();