interface DiscgolfMetrixCompetition {
  Name: string;
  TourDateStart: string;
  Events: DiscgolfMetrixCompetitionEvent[];
  Results: DiscgolfMetrixResult[];
}

interface DiscgolfMetrixCompetitionEvent {
  ID: string;
  Name: string;
}

export interface DiscgolfMetrixResult {
  ClassName: string;
  Name: string;
  Diff: number;
  UserID: string;
}

export default interface DiscgolfMetrixResponse {
  Competition: DiscgolfMetrixCompetition;
}
