export const getNameInitials = (firstName = "", lastName = "") => {
  const firstInitial = firstName.charAt(0).toUpperCase() || "";
  const lastInitial = lastName.charAt(0).toUpperCase() || "";
  return firstInitial + lastInitial;
};

export const toWordCase = (string) => {
  return string
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
