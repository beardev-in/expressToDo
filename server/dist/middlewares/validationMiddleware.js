import { body, param, query } from "express-validator";
function userDetailsValidation() {
    return [
        body("firstname").isLength({ min: 3 }).withMessage("First name must be a minimum of 3 characters"),
        body("email").isEmail().withMessage("Email must be valid"),
        body("password").isStrongPassword({
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1,
        }).withMessage("Password must be at least 6 characters long, include 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 number"),
        body("age").isInt({ min: 12, max: 60 }).withMessage('Age must be between 12 and 60'),
    ];
}
function userDetailsUpdateValidation() {
    return [
        body("age").isInt({ min: 12, max: 60 }).withMessage('Age must be between 12 and 60'),
    ];
}
function userIdValidation() {
    return [
        param('userId').isMongoId().withMessage("userId must be mongo object ID"),
    ];
}
function taskDataValidation() {
    //validation middleware for fields return an array of error objects when invoked
    return [
        body("taskname")
            .notEmpty().withMessage("TaskName cannot be empty")
            .isLength({ min: 6, max: 40 })
            .withMessage("TaskName must be a minimum of 6 to 40 characters"),
        body("deadline")
            .notEmpty().withMessage("Deadline cannot be empty")
            .custom((value, { req }) => {
            if (req.body.status === "true")
                return true;
            const now = new Date();
            const deadline = new Date(value);
            const fifteenMinutesLater = now.getTime() + (15 * 60 * 1000);
            const oneMonthLater = now.getTime() + (30 * 24 * 60 * 60 * 1000);
            if (deadline < now || deadline.getTime() < fifteenMinutesLater || deadline.getTime() > oneMonthLater) {
                return false;
            }
            return true;
        })
            .withMessage("Deadline must be of valid format and cannot be backdated, within 15 minutes from now, or exceed 1 month from now")
    ];
    //next(); -> since next can't be invoked, isDataValid function is invoked 
}
function taskIdValidation() {
    return [
        param('taskId').isMongoId().withMessage("the taskId must be mongo object ID"),
    ];
}
function taskstatusValidation() {
    return [
        body("taskstatus").isBoolean().withMessage("status must be boollean"),
    ];
}
function tasksCompletionQueryValidation() {
    return [
        query('completed')
            .isBoolean()
            .equals('true')
            .withMessage('The completed query parameter must be true')
    ];
}
export { userDetailsValidation, userIdValidation, userDetailsUpdateValidation, taskDataValidation, taskIdValidation, taskstatusValidation, tasksCompletionQueryValidation };
