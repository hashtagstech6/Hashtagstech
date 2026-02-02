export interface GlobalPartner {
  id: string;
  name: string;
  role: string;
  country: string;
  image: string; // URL to person's image
  flag: string; // URL to country flag background
}

export const globalPartners: GlobalPartner[] = [
  {
    id: "1",
    name: "Ahmed Al-Sayed", // Placeholder name
    role: "Partner in Oman",
    country: "Oman",
    image: "/placeholder.svg", // Replace with actual image
    flag: "/placeholder.svg", // Replace with actual flag
  },
  {
    id: "2",
    name: "Vanessa Corpuz-Baiceanu",
    role: "Partner in Cyprus",
    country: "Cyprus",
    image: "/placeholder.svg", // Replace with actual image
    flag: "/placeholder.svg", // Replace with actual flag
  },
];
