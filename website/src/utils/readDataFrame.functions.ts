import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions';
import { readDataFrameOfUser } from './readDataFrame.server';
import { createServerFn } from '@tanstack/react-start';

export const readDataFrame = createServerFn({ method: 'GET' })
  .middleware([staticFunctionMiddleware])
  .inputValidator((userId: number) => userId)
  .handler(async (ctx) => {
    return await readDataFrameOfUser(String(ctx.data));
  });
