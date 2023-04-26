import {
  LxdDevices,
  LxdDiskDevice,
  LxdIsoDevice,
  LxdNicDevice,
} from "types/device";

interface EmptyDevice {
  type: "";
  name: string;
}

interface UnknownDevice {
  type: "unknown";
  name: string;
  bare: string;
}

export interface IsoVolumeDevice {
  type: "iso-volume";
  name: string;
  bare: LxdIsoDevice;
}

export interface CustomNetworkDevice {
  type: "custom-nic";
  name: string;
  bare: LxdNicDevice;
}

export type FormDevice =
  | (Partial<LxdDiskDevice> & Required<Pick<LxdDiskDevice, "name">>)
  | (Partial<LxdNicDevice> & Required<Pick<LxdNicDevice, "name">>)
  | UnknownDevice
  | CustomNetworkDevice
  | IsoVolumeDevice
  | EmptyDevice;

export interface FormDeviceValues {
  devices: FormDevice[];
}

export const isEmptyDevice = (device: FormDevice) =>
  device.type === "nic" &&
  device.name.length === 0 &&
  (device.network?.length ?? 0) === 0;

export const formDeviceToPayload = (devices: FormDevice[]) => {
  return devices
    .filter((item) => !isEmptyDevice(item))
    .reduce((obj, { name, ...item }) => {
      if (
        item.type === "unknown" ||
        item.type === "custom-nic" ||
        item.type === "iso-volume"
      ) {
        return {
          [name]: item.bare,
        };
      }
      return {
        ...obj,
        [name]: item,
      };
    }, {});
};

export const parseDevices = (devices: LxdDevices): FormDevice[] => {
  return Object.keys(devices).map((key) => {
    const item = devices[key];

    const isCustomNetwork =
      item.type === "nic" &&
      Object.keys(item).some(
        (key) => !["type", "name", "network"].includes(key)
      );

    switch (item.type) {
      case "nic":
        if (isCustomNetwork) {
          return {
            name: key,
            bare: item,
            type: "custom-nic",
          };
        }

        return {
          name: key,
          network: item.network,
          type: "nic",
        };
      case "disk":
        return {
          name: key,
          path: "path" in item ? item.path : undefined,
          pool: item.pool,
          size: "size" in item ? item.size : undefined,
          type: "disk",
        };
      default:
        return {
          name: key,
          bare: item,
          type: "unknown",
        };
    }
  });
};
