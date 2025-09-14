const API_URL = "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

export const fetchData = async () => {
  const data = await fetch(API_URL).then(response => response.json());
  const menu = data.menu.map((menu) => {
    return {
      ...menu,
      image: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${menu.image}?raw=true`
    };
  });

  return menu;
};
