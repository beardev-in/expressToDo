export const minDate = new Date(Date.now() + 15 * 60 * 1000).toISOString().slice(0, 16);
export const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

export type badInput = {
    msg: string,
    path: string,
    type: string,
    value: string,
    location: string
  }

export type userErrors = {
    errors?: badInput[],
    msg?: string,
    path?: string
}

export type taskType = {
    taskname: string,
    deadline: string,
    taskstatus: string,
    userId: string,
    _id: string
}

export type editTaskType = {
    editTask : {
        taskname: string,
        deadline: string,
        taskstatus: string
    },
    fieldErrors: { [key: string]: string } | null
}

export type axiosErrorType = {
    errors?: badInput[],
    msg?: string,
    path?: string
}

export type userInfoType = { 
    firstname: string, 
    email: string, 
    age: string, 
    avatar: string | undefined, 
    _id: string, 
    tasks: string[], 
    password: string 
}

export type initialLoginStateType = {
    formData: {
        email: string;
        password: string;
    },
    alert: { type: string; message: string } | null
}

export type initialRegisterStateType = {
    formData: {
        firstname: string;
        email: string;
        password: string;
        age: string;
    },
    alert: { type: string; message: string } | null,
    fieldErrors: { [key: string]: string } | null
}

export type initialDashboardStateType = {
    tasks: taskType[];
    userDetails: userInfoType;
}

export type initialProfileStateType = {
    avatarModal: boolean;
    updatedAge: string;
}

export type addTaskType = {
    addTask: {
        taskname: string,
        deadline: string
    },
    fieldErrors: { [key: string]: string } | null
}
