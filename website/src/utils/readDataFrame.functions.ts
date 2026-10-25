import { createServerFn } from '@tanstack/react-start';
import { staticFunctionMiddleware } from '@tanstack/start-static-server-functions';

import { readDataFrameOfUser } from './readDataFrame.server';

export const readDataFrame = createServerFn({ method: 'GET' })
  .middleware([staticFunctionMiddleware])
  .validator((userId: number) => userId)
  .handler(async (ctx) => {
    return await readDataFrameOfUser(String(ctx.data));
  });
