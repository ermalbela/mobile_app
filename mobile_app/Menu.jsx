import { Ionicons } from "@expo/vector-icons";

export const MENUITEMS = [
  {
    menutitle: "General",
    menucontent: "Dashboards",
    Items: [
      {
        title: "Dashboard",
        icon: (props) => <Ionicons name="home-outline" {...props} />,
        type: "link",
        path: `Dashboard`,
      },
      {
        title: "Favorites",
        icon: (props) => <Ionicons name="star-outline" {...props} />,
        type: "link",
        path: `Favorites`,
      },
      // {
      //   title: "Watch Later",
      //   icon: CheckSquare,
      //   type: "link",
      //   path: `/watch_later`,
      // },
      // {
      //   title: "Account Settings",
      //   icon: Star,
      //   type: "link",
      //   path: `/account`,
      // },
      {
        title: "Admin",
        icon: (props) => <Ionicons name="person-outline" {...props} />,
        type: "link",
        path: `Admin_dashboard`,
        roles: ["Admin", "Superadmin"], // only show if the user is admin or superadmin
      },
      {
        title: "Genres",
        icon: (props) => <Ionicons name="grid-outline" {...props} />,
        type: "sub",
        children: [
          {
            path: `/filter_movies?genre=action`,
            title: "Action",
            type: "link",
            icon: (props) => <Ionicons name="flash-outline" {...props} />,
          },
          {
            path: `/filter_movies?genre=comedy`,
            title: "Comedy",
            type: "link",
            icon: (props) => <Ionicons name="happy-outline" {...props} />,
          },
          {
            path: `/filter_movies?genre=drama`,
            title: "Drama",
            type: "link",
            icon: (props) => <Ionicons name="people-outline" {...props} />,
          },
          {
            path: `/filter_movies?genre=horror`,
            title: "Horror",
            type: "link",
            icon: (props) => <Ionicons name="warning-outline" {...props} />,
          },
          {
            path: `/filter_movies?genre=romance`,
            title: "Romance",
            type: "link",
            icon: (props) => <Ionicons name="heart-outline" {...props} />,
          },
          {
            path: `/filter_movies?genre=fantasy`,
            title: "Fantasy",
            type: "link",
            icon: (props) => <Ionicons name="moon-outline" {...props} />,
          },
          {
            path: `/filter_movies?genre=animation`,
            title: "Animation",
            type: "link",
            icon: (props) => <Ionicons name="tv-outline" {...props} />,
          },
          {
            path: `/filter_movies?genre=thriller`,
            title: "Thriller",
            type: "link",
            icon: (props) => <Ionicons name="eye-outline" {...props} />,
          },
        ],
      },
    ],
  },
];

export const actors = [
  { value: "Leonardo DiCaprio", label: "Leonardo DiCaprio" },
  { value: "Scarlett Johansson", label: "Scarlett Johansson" },
  { value: "Tom Hanks", label: "Tom Hanks" },
  { value: "Meryl Streep", label: "Meryl Streep" },
  { value: "Denzel Washington", label: "Denzel Washington" },
  { value: "Natalie Portman", label: "Natalie Portman" },
  { value: "Brad Pitt", label: "Brad Pitt" },
  { value: "Cate Blanchett", label: "Cate Blanchett" },
  { value: "Robert Downey Jr.", label: "Robert Downey Jr." },
  { value: "Jennifer Lawrence", label: "Jennifer Lawrence" },
];

export const genres = [
  { value: "action", label: "action" },
  { value: "comedy", label: "comedy" },
  { value: "drama", label: "drama" },
  { value: "horror", label: "horror" },
  { value: "romance", label: "romance" },
  { value: "sci-fi", label: "sci-fi" },
  { value: "fantasy", label: "fantasy" },
  { value: "documentary", label: "documentary" },
  { value: "animation", label: "animation" },
  { value: "thriller", label: "thriller" },
];

export const directors = [
  { value: "Steven Spielberg", label: "Steven Spielberg" },
  { value: "Christopher Nolan", label: "Christopher Nolan" },
  { value: "Martin Scorsese", label: "Martin Scorsese" },
  { value: "Greta Gerwig", label: "Greta Gerwig" },
  { value: "Quentin Tarantino", label: "Quentin Tarantino" },
  { value: "James Cameron", label: "James Cameron" },
  { value: "Chloé Zhao", label: "Chloé Zhao" },
  { value: "Jordan Peele", label: "Jordan Peele" },
  { value: "Patty Jenkins", label: "Patty Jenkins" },
  { value: "Bong Joon-ho", label: "Bong Joon-ho" },
];

export const languages = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Italian", label: "Italian" },
  { value: "Albanian", label: "Albanian" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Russian", label: "Russian" },
  { value: "Arabic", label: "Arabic" },
  { value: "Turkish", label: "Turkish" },
  { value: "Greek", label: "Greek" },
  { value: "Dutch", label: "Dutch" },
  { value: "Polish", label: "Polish" },
  { value: "Romanian", label: "Romanian" },
  { value: "Hungarian", label: "Hungarian" },
  { value: "Serbian", label: "Serbian" },
  { value: "Croatian", label: "Croatian" },
  { value: "Bosnian", label: "Bosnian" },
  { value: "Japanese", label: "Japanese" },
  { value: "Korean", label: "Korean" },
  { value: "Mandarin", label: "Mandarin" },
  { value: "Cantonese", label: "Cantonese" },
  { value: "Hindi", label: "Hindi" },
  { value: "Urdu", label: "Urdu" },
  { value: "Bengali", label: "Bengali" },
  { value: "Punjabi", label: "Punjabi" },
  { value: "Swedish", label: "Swedish" },
  { value: "Finnish", label: "Finnish" },
  { value: "Norwegian", label: "Norwegian" },
  { value: "Danish", label: "Danish" },
  { value: "Thai", label: "Thai" },
  { value: "Vietnamese", label: "Vietnamese" },
  { value: "Persian", label: "Persian" },
  { value: "Malay", label: "Malay" },
  { value: "Indonesian", label: "Indonesian" },
];
