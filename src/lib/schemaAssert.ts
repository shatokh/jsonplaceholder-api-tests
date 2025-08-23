import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
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
      return `• ${path} — ${e.message} (${params})`;
    })
    .join('\n');
}
