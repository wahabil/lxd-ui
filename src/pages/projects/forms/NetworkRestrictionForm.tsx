import React, { FC } from "react";
import { Textarea } from "@canonical/react-components";
import { getInstanceConfigurationRow } from "components/forms/InstanceConfigurationRow";
import InstanceConfigurationTable from "components/forms/InstanceConfigurationTable";
import { ProjectFormValues } from "pages/projects/CreateProject";
import { FormikProps } from "formik/dist/types";
import { getProjectKey } from "util/projectConfigFields";

export interface NetworkRestrictionFormValues {
  restricted_network_access?: string;
  restricted_network_subnets?: string;
  restricted_network_uplinks?: string;
  restricted_network_zones?: string;
}

export const networkRestrictionPayload = (
  values: NetworkRestrictionFormValues,
) => {
  return {
    [getProjectKey("restricted_network_access")]:
      values.restricted_network_access,
    [getProjectKey("restricted_network_subnets")]:
      values.restricted_network_subnets,
    [getProjectKey("restricted_network_uplinks")]:
      values.restricted_network_uplinks,
    [getProjectKey("restricted_network_zones")]:
      values.restricted_network_zones,
  };
};

interface Props {
  formik: FormikProps<ProjectFormValues>;
}

const NetworkRestrictionForm: FC<Props> = ({ formik }) => {
  return (
    <InstanceConfigurationTable
      rows={[
        getInstanceConfigurationRow({
          formik,
          name: "restricted_network_access",
          label: "Available networks",
          defaultValue: "",
          children: <Textarea placeholder="Enter network names" />,
        }),

        getInstanceConfigurationRow({
          formik,
          name: "restricted_network_subnets",
          label: "Network subnets",
          defaultValue: "",
          children: <Textarea placeholder="Enter network subnets" />,
        }),

        getInstanceConfigurationRow({
          formik,
          name: "restricted_network_uplinks",
          label: "Network uplinks",
          defaultValue: "",
          children: <Textarea placeholder="Enter network names" />,
        }),

        getInstanceConfigurationRow({
          formik,
          name: "restricted_network_zones",
          label: "Network zones",
          defaultValue: "",
          children: <Textarea placeholder="Enter network zones" />,
        }),
      ]}
    />
  );
};

export default NetworkRestrictionForm;
