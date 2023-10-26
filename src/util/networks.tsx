import { LxdInstance } from "types/instance";
import { LxdNetwork, LxdNetworkConfig } from "types/network";

export const getIpAddresses = (
  instance: LxdInstance,
  family: "inet" | "inet6",
) => {
  if (!instance.state?.network) return [];
  return Object.entries(instance.state.network)
    .filter(([key, _value]) => key !== "lo")
    .flatMap(([_key, value]) => value.addresses)
    .filter((item) => item.family === family)
    .map((item) => item.address);
};

const networkDefaults: Record<string, string> = {
  bridge_driver: "native",
  bridge_hwaddr: "-",
  bridge_mode: "standard",
  bridge_mtu: "1500",
  dns_domain: "lxd",
  dns_mode: "managed",
  dns_search: "-",
  fan_type: "vxlan",
  fan_overlay_subnet: "240.0.0.0/8",
  fan_underlay_subnet: "auto",
  ipv4_address: "auto",
  ipv4_dhcp: "true",
  ipv4_dhcp_expiry: "1h",
  ipv4_dhcp_ranges: "all addresses",
  ipv4_l3only: "false",
  ipv4_nat: "true",
  ipv4_nat_address: "-",
  ipv4_ovn_ranges: "-",
  ipv6_address: "auto",
  ipv6_dhcp: "true",
  ipv6_dhcp_expiry: "1h",
  ipv6_dhcp_ranges: "all addresses",
  ipv6_dhcp_stateful: "false",
  ipv6_l3only: "false",
  ipv6_nat: "true",
  ipv6_nat_address: ".",
  ipv6_ovn_ranges: "-",
};

export const getLxdDefault = (formField: string): string => {
  if (Object.keys(networkDefaults).includes(formField)) {
    return networkDefaults[formField];
  }
  return "";
};

const hasNetworkConfigDiff = (
  a: Partial<LxdNetworkConfig>,
  b: Partial<LxdNetworkConfig>,
) => {
  return (Object.keys(a) as Array<keyof typeof a>).some((key) => {
    const isIp = key === "ipv4.address" || key === "ipv6.address";
    if (isIp && a[key] === "auto" && b[key] !== "") {
      return false;
    }
    return a[key] !== b[key];
  });
};

export const areNetworksEqual = (
  a: Partial<LxdNetwork> & Required<Pick<LxdNetwork, "config">>,
  b: Partial<LxdNetwork> & Required<Pick<LxdNetwork, "config">>,
) => {
  if (hasNetworkConfigDiff(a.config, b.config)) {
    return false;
  }

  const hasMainKeyDiff = (Object.keys(a) as Array<keyof typeof a>).some(
    (key) => (key === "config" || key === "etag" ? false : a[key] !== b[key]),
  );

  return !hasMainKeyDiff;
};
