import { init } from '@instantdb/react';
import schema from '../instant.schema';

export const db = init({
  appId: '3cca11e5-39a0-4532-8138-7422b21abae3',
  schema,
});
