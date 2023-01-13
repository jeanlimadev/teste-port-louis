import fs from 'fs';

import { validateInvoices } from './validateInvoices';
import { validateInvoiceSchema } from './validateInvoiceSchema';

import { invoiceLine } from '../dtos/invoiceLine';

export function readInvoices(path: string): invoiceLine[] {
  const invoices: invoiceLine[] = [];
  const files = fs.readdirSync(path);

  files.forEach(file => {
    const content = fs.readFileSync(path + '/' + file, 'utf-8');
    const contentToJson = content.split('\n').map(line => JSON.parse(line.trim()));

    contentToJson.forEach(invoiceItem => {
      validateInvoiceSchema(invoiceItem, file)
      invoices.push(invoiceItem);
    });
  });

  validateInvoices(invoices);

  return invoices;
};