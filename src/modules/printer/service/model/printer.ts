import { z } from "zod"

const positionSchema = z.object({
  x: z.number().describe("X coordinate"),
  y: z.number().describe("Y coordinate"),
  z: z.number().describe("Z coordinate"),
})

export const printerInfoSchema = z.object({
  name: z.string().describe("Name of the printer"),
  model: z.string().describe("Model of the printer"),
  position: positionSchema.describe("Current position of the printer head"),
  firmwareVersion: z.string().describe("Firmware version of the printer"),
  serialNumber: z.string().describe("Serial number of the printer"),
  macAddress: z.string().describe("MAC address of the printer"),
})

export type PrinterInfo = z.infer<typeof printerInfoSchema>

export const printerProgressSchema = z.object({
  bytes: z.object({
    completedBytes: z.number().describe("Number of bytes printed so far"),
    totalBytes: z.number().describe("Total number of bytes to print"),
    percentage: z.number().describe("Percentage of bytes printed"),
  }),
  layer: z.object({
    currentLayer: z.number().describe("Current layer being printed"),
    totalLayers: z.number().describe("Total number of layers to print"),
    percentage: z.number().describe("Percentage of layers printed"),
  }),
})

export type PrinterProgress = z.infer<typeof printerProgressSchema>

export interface Printer {
  id: string
  getInfo(): Promise<PrinterInfo>
  getProgress(): Promise<PrinterProgress>
}
