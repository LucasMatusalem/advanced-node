import { IMemoryDb, newDb } from 'pg-mem'

export const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
  if ((entities == null) || (entities.length === 0)) {
    entities = ['src/infra/postgres/entities/*']
  }
  const db = newDb()
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities
  })
  await connection.synchronize()
  return db
}
