import { protectedProcedure, createTRPCRouter } from "@lib/api/trpc";

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => ctx.user),
});
