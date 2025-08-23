import Ajv2020, { ErrorObject } from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

// strict=false - чтобы не спотыкаться о доп. поля мока; allErrors=true - полный отчёт
const ajv = new Ajv2020({ allErrors: true, strict: false });
// Поддержка форматов (email/uri и т.д.)
addFormats(ajv);

export function assertSchema(data: unknown, schema: object): void {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    const msg = formatErrors(validate.errors);
    throw new Error(`Schema validation failed:\n${msg}`);
  }
}

function formatErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors) return 'No errors provided by Ajv';
  return errors
    .map((e) => {
      const path = e.instancePath || e.schemaPath || '<root>';
      const params = JSON.stringify(e.params);
      return `• ${path} - ${e.message} (${params})`;
    })
    .join('\n');
}
