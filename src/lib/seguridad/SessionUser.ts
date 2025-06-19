type Profile = { name: string; photoUrl: string };
let subscribers: ((profile: Profile) => void)[] = [];

export const setUserProfile = (profile: Profile) => {
  localStorage.setItem('userName', profile.name);
  localStorage.setItem('userPhoto', profile.photoUrl);

  // Notificar a los listeners
  subscribers.forEach(fn => fn(profile));
};

export const getUserProfile = (): Profile => {
  return {
    name: localStorage.getItem('userName') || '',
    photoUrl: localStorage.getItem('userPhoto') || '',
  };
};

export const onUserProfileChange = (callback: (profile: Profile) => void) => {
  subscribers.push(callback);
};

export const removeUserProfileListener = (callback: (profile: Profile) => void) => {
  subscribers = subscribers.filter(fn => fn !== callback);
};
