export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  MainApp: undefined;
  CreateProject: undefined;
  ProjectMap: { project: {
    id: string;
    name: string;
    date: string;
    description?: string;
    streetIds: number[];
  } };
};