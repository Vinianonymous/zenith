

export type Task = {

    name: string;

    dueDate: string;

    description: string;

    id: string;
    timeSpent: number;
};

export type Settings = {
    cyclePeriod: number;
    cycleAlarmPath: string;
    tickingEnabled:boolean;
    tickingSoundPath:string;
    cycleMessages:string[];
};
export type editTaskRequest = {
    newData:Task
};
