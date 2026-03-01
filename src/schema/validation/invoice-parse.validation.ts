import { z } from 'zod'

export const InvoiceSchema = z.object({
  fileName: z.string(),
  numeroCliente: z.number(),
  nomeCliente: z.string(),
  mesReferencia: z.string(),

  energia: z.object({
    kwh: z.number(),
    valor: z.number(),
  }),

  energiaSceeeSIcms: z.object({
    kwh: z.number(),
    valor: z.number(),
  }),

  energiaCompensadaGdI: z.object({
    kwh: z.number(),
    valor: z.number(),
  }),

  ilumPublica: z.number(),
})
