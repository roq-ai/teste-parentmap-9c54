import { Prisma } from '@prisma/client';

export function generateFilterByPathUtil(path: string[], targetId: string) {
  const models = Prisma.dmmf.datamodel.models;

  function createFilter(subPath: string[]): any {
    const [current, ...rest] = subPath;

    if (rest.length === 0) {
      return {
        id: targetId,
      };
    }

    const model = models.find((m) => m.name.toLowerCase() === current);
    const relationFields = model.fields.filter((f) => f.relationName);
    const nextField = relationFields.find((rf) => rf.type.toLowerCase() === rest[0]);
    return {
      [nextField.name]: {
        some: createFilter(rest),
      },
    };
  }

  return createFilter(path);
}
