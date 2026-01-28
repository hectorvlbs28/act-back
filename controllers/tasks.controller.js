const { createTaskSuccessMessage } = require('../utils/succesMessages');
const { createTaskErrorMessage } = require('../utils/errorMessages');
const { handleError } = require('../utils/handleError');
const HttpStatus = require('../utils/httpStatus');
const { createTask } = require('../services/database/tasks');

exports.create = async (req, res) => {
  try {
    const { title, description, userId: user_id } = req.body;
    await createTask(title, description, user_id);
    return res.status(HttpStatus.CREATED).send({
      message: createTaskSuccessMessage(title),
    });
  } catch (error) {
    console.log('-- Error in signup controller -> error: ', error.message);
    return handleError(res, HttpStatus.INTERNAL_SERVER_ERROR, createTaskErrorMessage);
  }
};
