import { z } from "zod";

export const agentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  host: z.string().min(1),
  ipAddress: z.string().min(1),
  status: z.enum(["online", "offline"]),
  lastSeenAt: z.string().datetime(),
});

export const printerSchema = z.object({
  id: z.string().min(1),
  agentId: z.string().min(1),
  name: z.string().min(1),
  isDefault: z.boolean().default(false),
  status: z.enum(["idle", "busy", "offline"]),
  capabilities: z.object({
    color: z.boolean().default(true),
    duplex: z.boolean().default(false),
    paperSizes: z.array(z.string()).default(["A4"]),
  }),
});

export const printSettingsSchema = z.object({
  copies: z.number().int().min(1).max(99).default(1),
  colorMode: z.enum(["color", "grayscale"]).default("color"),
  orientation: z.enum(["portrait", "landscape"]).default("portrait"),
  duplex: z.enum(["none", "long-edge", "short-edge"]).default("none"),
  paperSize: z.string().default("A4"),
});

export const printJobStatusSchema = z.enum([
  "queued",
  "downloading",
  "printing",
  "completed",
  "failed",
]);

export const printJobSchema = z.object({
  id: z.string().min(1),
  printerId: z.string().min(1),
  printerName: z.string().min(1),
  agentId: z.string().min(1),
  fileName: z.string().min(1),
  fileUrl: z.string().url(),
  mimeType: z.string().min(1),
  status: printJobStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  error: z.string().optional(),
  settings: printSettingsSchema,
});

export const createPrintJobSchema = z.object({
  printerId: z.string().min(1),
  printerName: z.string().min(1),
  agentId: z.string().min(1),
  fileName: z.string().min(1),
  fileUrl: z.string().url(),
  mimeType: z.string().min(1),
  settings: printSettingsSchema,
});

export const updatePrintJobStatusSchema = z.object({
  status: printJobStatusSchema,
  error: z.string().optional(),
});

export type Agent = z.infer<typeof agentSchema>;
export type Printer = z.infer<typeof printerSchema>;
export type PrintSettings = z.infer<typeof printSettingsSchema>;
export type PrintJobStatus = z.infer<typeof printJobStatusSchema>;
export type PrintJob = z.infer<typeof printJobSchema>;
export type CreatePrintJob = z.infer<typeof createPrintJobSchema>;
export type UpdatePrintJobStatus = z.infer<typeof updatePrintJobStatusSchema>;
