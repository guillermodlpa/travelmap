// Web application custom types

type ResponsiveViewportSize = 'small' | 'medium' | 'large';

type ClientIndividualTravelMap = {
  type: 'individual';
  id: string;
  created: number;
  pathView: string;
  userId: string;
  userDisplayName: string;
  userPictureUrl: string | null;
  visitedCountries: string[];
};

type ClientCombinedTravelMap = {
  type: 'combined';
  id: string;
  created: number;
  pathView: string;
  individualTravelMaps: ClientIndividualTravelMap[];
};
