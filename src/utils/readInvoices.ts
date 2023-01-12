import fs from 'fs';

import { invoice } from '../dtos/invoice';
import { validateInvoices } from './validateInvoices';
import { validateInvoiceSchema } from './validateInvoiceSchema';

export function readInvoices(dir: string): invoice[] {
  const invoices: invoice[] = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const content = fs.readFileSync(dir + '/' + file, 'utf-8');
    const contentToJson = content.split('\n').map(line => JSON.parse(line.trim()));

    contentToJson.forEach(line => {
      validateInvoiceSchema(line)
      invoices.push(line);
    });
  });

  validateInvoices(invoices);

  return invoices;
};