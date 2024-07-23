import { z } from "zod"


export const createExchangeApiSchema = z.object({
  exchange: z.string(),
  accountName: z.string(),
  api: z.string(),
  secret: z.string(),
  passphrase: z.string().optional(),
  description: z.string().optional(),
})

export type CreateExchangeApiSchema = z.infer<typeof createExchangeApiSchema>

export const updateExchangeApiSchema = z.object({
  accountName: z.string(),
  api: z.string(),
  secret: z.string(),
  passphrase: z.string().optional(),
  description: z.string().optional(),
})

export type UpdateExchangeApiSchema = z.infer<typeof updateExchangeApiSchema>

export const createCopyTradingSchema = z.object({
  // exchangeName: z.string(),
  // exchange: z.string(),
  apis: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  // apis: z.string().refine((value) => value.trim().length > 0, {
  //   message: "You have to select at least one API.",
  // }),
  fixedAmount: z.string().optional(),
  multiplierAmount: z.string().optional(),
  takeProfit: z.string().optional(),
  stopLoss: z.string().optional(),
})
.refine(data => data.fixedAmount || data.multiplierAmount, {
  message: "You must fill at least one of fixedAmount or multiplierAmount.",
  path: ["fixedAmount"], // This makes the error appear on both fields
})
.refine(data => data.fixedAmount || data.multiplierAmount, {
  message: "You must fill at least one of fixedAmount or multiplierAmount.",
  path: ["multiplierAmount"], // This makes the error appear on both fields
});

export type CreateCopyTradingSchema = z.infer<typeof createCopyTradingSchema>

export const updateCopyTradingSchema = z.object({
  // apis: z.string(),
  apis: z.string().optional(),
  fixedAmount: z.string().optional(),
  multiplierAmount: z.string().optional(),
})
.refine(data => data.fixedAmount || data.multiplierAmount, {
  message: "You must fill at least one of fixedAmount or multiplierAmount.",
  path: ["fixedAmount"], // This makes the error appear on both fields
})
.refine(data => data.fixedAmount || data.multiplierAmount, {
  message: "You must fill at least one of fixedAmount or multiplierAmount.",
  path: ["multiplierAmount"], // This makes the error appear on both fields
});

export type UpdateCopyTradingSchema = z.infer<typeof updateCopyTradingSchema>
