// @ts-ignore - prisma package does not ship declaration files
import type { PrismaConfig } from 'prisma'

export default {
  earlyAccess: true,
  schema: {
    kind: 'single',
    filePath: './prisma/schema.prisma',
  },
} satisfies PrismaConfig
