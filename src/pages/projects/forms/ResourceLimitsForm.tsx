import React, { FC } from "react";
import { Input } from "@canonical/react-components";
import { getConfigurationRow } from "pages/instances/forms/ConfigurationRow";
import ConfigurationTable from "pages/instances/forms/ConfigurationTable";
import { ProjectFormValues } from "pages/projects/CreateProjectForm";
import { FormikProps } from "formik/dist/types";
import { SharedFormikTypes } from "pages/instances/forms/sharedFormTypes";

export interface ResourceLimitsFormValues {
  limits_instances?: number;
  limits_containers?: number;
  limits_virtual_machines?: number;
  limits_disk?: string;
  limits_networks?: number;
  limits_cpu?: number;
  limits_memory?: number;
  limits_processes?: number;
}

export const resourceLimitsPayload = (values: ProjectFormValues) => {
  return {
    ["limits.instances"]: values.limits_instances?.toString(),
    ["limits.containers"]: values.limits_containers?.toString(),
    ["limits.virtual-machines"]: values.limits_virtual_machines?.toString(),
    ["limits.disk"]: values.limits_disk?.toString(),
    ["limits.networks"]: values.limits_networks?.toString(),
    ["limits.cpu"]: values.limits_cpu?.toString(),
    ["limits.memory"]: values.limits_memory?.toString(),
    ["limits.processes"]: values.limits_processes?.toString(),
  };
};

interface Props {
  formik: FormikProps<ProjectFormValues>;
}

const ResourceLimitsForm: FC<Props> = ({ formik }) => {
  return (
    <ConfigurationTable
      formik={formik as unknown as SharedFormikTypes}
      rows={[
        getConfigurationRow({
          formik: formik as unknown as SharedFormikTypes,
          name: "limits_instances",
          label: "Max number of instances",
          defaultValue: "",
          children: <Input placeholder="Enter number" min={0} type="number" />,
        }),

        getConfigurationRow({
          formik: formik as unknown as SharedFormikTypes,
          name: "limits_containers",
          label: "Max number of containers",
          defaultValue: "",
          children: <Input placeholder="Enter number" min={0} type="number" />,
        }),

        getConfigurationRow({
          formik: formik as unknown as SharedFormikTypes,
          name: "limits_virtual_machines",
          label: "Max number of VMs",
          defaultValue: "",
          children: <Input placeholder="Enter number" min={0} type="number" />,
        }),

        getConfigurationRow({
          formik: formik as unknown as SharedFormikTypes,
          name: "limits_disk",
          label: "Max disk space (used by all instances)",
          defaultValue: "",
          children: <Input placeholder="Enter number" min={0} type="number" />,
        }),

        getConfigurationRow({
          formik: formik as unknown as SharedFormikTypes,
          name: "limits_networks",
          label: "Max number of networks",
          defaultValue: "",
          children: <Input placeholder="Enter number" min={0} type="number" />,
        }),

        getConfigurationRow({
          formik: formik as unknown as SharedFormikTypes,
          name: "limits_cpu",
          label: "Max sum of individual CPU configurations",
          defaultValue: "",
          children: <Input placeholder="Enter number" min={0} type="number" />,
        }),

        getConfigurationRow({
          formik: formik as unknown as SharedFormikTypes,
          name: "limits_memory",
          label: "Max sum of individual memory limits",
          defaultValue: "",
          children: <Input placeholder="Enter number" min={0} type="number" />,
        }),

        getConfigurationRow({
          formik: formik as unknown as SharedFormikTypes,
          name: "limits_processes",
          label: "Max sum of individual processes configurations",
          defaultValue: "",
          children: <Input placeholder="Enter number" min={0} type="number" />,
        }),
      ]}
    />
  );
};

export default ResourceLimitsForm;
