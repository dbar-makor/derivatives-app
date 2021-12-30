import { IFloorBroker } from "../models/derivatives";

export const convertBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const groupByCompany = (data: IFloorBroker[]) => {
  return Array.from(
    data.reduce((acc, item) => {
      const key = item.company;
      if (acc.has(key)) {
        acc.get(key).push(item);
      } else {
        acc.set(key, [item]);
      }
      return acc;
    }, new Map())
  );
};
