const logsTypes = {
  CREATE: "create",
  DELETE: "delete",
  UPDATE: "update",
};

const passwordsPaths = {
  CREATE: "/create",
  GET_ALL: "/get/all",
  GET_VALUE_ID: "/get/value/:id",
  DELETE_VALUE_ID: "/delete/value/:id",
  UPDATE_VALUE_ID: "/update/value/:id",
};

module.exports = {
  logsTypes,
  passwordsPaths,
};
