interface User {
  id: string;
  name: string;
}

interface LoggedInUser extends User {
  email: string;
}

interface TravelMap {
  id: string;
  slug: string;
  countries: string[];
}

interface UserTravelMap {
  userId: string;
  travelMapId: string;
}
