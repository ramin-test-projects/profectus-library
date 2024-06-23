import { Dictionary } from "@/types/basic";

type Route = {
  title: string;
  path: string;
  fullPath?: string;
  children?: Dictionary<Route>;
  sidebar?: boolean;
};

const _Routes: {
  home: Route;
  book: Route & { children: { new: Route } };
  login: Route;
} = {
  home: { title: "Home", path: "/" },
  book: { title: "Book", path: "/book", children: { new: { title: "New Book", path: "/new" } } },
  login: { title: "Login", path: "/login", sidebar: false },
};

const setFullPath = ({ route, path }: { route: Route; path: string }) => {
  const fullPath = (route.fullPath = `${path}${route.path}`);

  Object.values(route.children || {}).map((r) => setFullPath({ route: r, path: fullPath }));
};

Object.values(_Routes).map((route) => setFullPath({ route, path: "" }));

export const Routes = _Routes;
