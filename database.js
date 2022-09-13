import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/project");

/**
 * 최초 데이터 1건을 조회한다.
 * @param {mongoose.Schema} schema
 * @param {object} filter
 * @returns
 */
export const FindFirst = async (schema, filter) => {
  return await schema
    .findOne(filter)
    .then((response) => response)
    .catch((error) => error);
};

/**
 * 데이터를 저장한다.
 * @param {mongoose.Schema} schema
 * @param {object[]} data
 */
export const Save = (schema, data) => {
  data.forEach((element) =>
    new schema(element)
      .save()
      .then((response) => response)
      .catch((error) => error)
  );
};

/**
 * 데이터를 조회하고, 최신순으로 조회한다.
 * @param {mongoose.Schema} schema
 * @param {object} filter
 * @param {number} limit
 * @returns
 */
export const Find = async (schema, filter = undefined, limit = undefined) => {
  return await schema
    .find(filter)
    .sort({ _id: -1 })
    .limit(limit)
    .then((response) => response)
    .catch((error) => error);
};

/**
 * 데이터를 삭제한다.
 * @param {mongoose.Schema} schema
 * @param {object[]} data
 * @returns { acknowledged: boolean, deletedCount: number }
 */
export const Delete = async (schema, filter = undefined) => {
  return await schema
    .deleteMany(filter)
    .then((response) => response)
    .catch((error) => error);
};