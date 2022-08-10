import { QueryRunner, getRepository, In, InsertResult } from 'typeorm';
import { IUser } from '../modelInterfaces';
import { Users } from '../models/users.model';

export const findUser = async (queryParam: Partial<IUser | any>, selectOptions: Array<keyof Users>, t?: QueryRunner): Promise<Users | undefined> => {
  return t
    ? t.manager.findOne(Users, {
        where: queryParam,
        ...(selectOptions.length && { select: selectOptions.concat(['id']) }),
      })
    : getRepository(Users).findOne({
        where: queryParam,
        ...(selectOptions.length && { select: selectOptions.concat(['id']) }),
      });
};

export const createAUser = async (payload: {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone_number?: string;
  is_business: boolean;
  t?: QueryRunner;
}): Promise<InsertResult> => {
  const { t, ...rest } = payload;
  return t ? t.manager.insert(Users, rest) : getRepository(Users).insert(rest);
};