export const setCreatorInLocalStorage = (creator: any) => {
  if (typeof window === 'undefined') {
    throw Error;
  }
  localStorage.setItem('Creator', JSON.stringify(creator));
};

export const deleteCreatorFromLocalStorage = () => {
  if (typeof window === 'undefined') {
    throw Error;
  }
  localStorage.removeItem('Creator');
};

export const getCreatorFromLocalStorage = (): any => {
  if (typeof window === 'undefined') {
    throw Error;
  }
  const saved = localStorage.getItem('Creator');
  const creator = saved ? JSON.parse(saved) : null;
  return creator;
};

export const setCampaignsInLocalStorage = (campaigns: any) => {
  if (typeof window === 'undefined') {
    throw Error;
  }
  localStorage.setItem('Campaigns', JSON.stringify(campaigns));
};

export const deleteCampaignsFromLocalStorage = () => {
  if (typeof window === 'undefined') {
    throw Error;
  }
  localStorage.removeItem('Campaigns');
};

export const getCampaignsFromLocalStorage = (): any => {
  if (typeof window === 'undefined') {
    throw Error;
  }
  const saved = localStorage.getItem('Campaigns');
  const Campaigns = saved ? JSON.parse(saved) : null;
  return Campaigns;
};
