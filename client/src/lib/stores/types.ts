export interface CalendarItem {
  id: string;
  name: string;
  wykonawca: string;
  data: string;
  godzinaRozp: string;
  godzinaZak: string;
  opis?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}
