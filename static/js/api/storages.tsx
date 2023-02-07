import { handleResponse } from "util/helpers";
import { LxdStorage } from "types/storage";
import { LxdApiResponse } from "types/apiResponse";

export const fetchStorages = (project: string): Promise<LxdStorage[]> => {
  return new Promise((resolve, reject) => {
    fetch(`/1.0/storage-pools?project=${project}&recursion=1`)
      .then(handleResponse)
      .then((data: LxdApiResponse<LxdStorage[]>) => resolve(data.metadata))
      .catch(reject);
  });
};
