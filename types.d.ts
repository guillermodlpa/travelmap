type User = {
  id: string;
  name: string;
  visitedCountries: string[];
};

type UserDatabaseEntity = User & {
  email: string;
  created: Date;
};

type LoggedInUser = UserDatabaseEntity;

type CombinedMapDatabaseEntity = {
  id: string;
  userIds: string[];
  created: Date;
};

type ResponsiveViewportSize = 'small' | 'medium' | 'large';

type TravelMap = {
  type: 'user' | 'multiple-user';
  id: string;
  users: Array<{
    id: string;
    name: string;
    visitedCountries: string[];
    pathView: string;
  }>;
  pathView: string;
  pathEdit?: string;
};

type ErrorResponse = {
  error: string;
};

//   /map/:userId - Show Guillermo's map
//   /mmap/:combinedMapId - Show a combined map
