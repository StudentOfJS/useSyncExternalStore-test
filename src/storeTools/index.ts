export const getStoreData = (
  storeKey: string,
  storeType: 'localStorage' | 'sessionStorage' = 'sessionStorage'
) => {
  let dataString = (window && window[storeType].getItem(storeKey)) ?? '';
  try {
    let value = dataString ? JSON.parse(dataString) : undefined;
    return value;
  } catch (err) {
    console.log(err);
  }
};

export const removeStoreData = (
  storeKeys: Array<string>,
  storeType: 'localStorage' | 'sessionStorage' = 'sessionStorage'
) => {
  if (window) {
    storeKeys.forEach((storeKey) => {
      window[storeType].removeItem(storeKey);
    });
  }
};
