import React, { FC } from "react";
import { Input } from "@canonical/react-components";
import { FormikProps } from "formik/dist/types";
import ConfigurationTable from "components/ConfigurationTable";
import { getStorageConfigurationRow } from "pages/storage/forms/StorageConfigurationRow";
import { StorageVolumeFormValues } from "pages/storage/forms/StorageVolumeForm";
import SnapshotScheduleInput from "components/SnapshotScheduleInput";
import { useDocs } from "context/useDocs";

interface Props {
  formik: FormikProps<StorageVolumeFormValues>;
}

const StorageVolumeFormSnapshots: FC<Props> = ({ formik }) => {
  const docBaseLink = useDocs();

  return (
    <ConfigurationTable
      rows={[
        getStorageConfigurationRow({
          formik,
          label: "Snapshot name pattern",
          name: "snapshots_pattern",
          defaultValue: "",
          children: (
            <Input
              placeholder="Enter name pattern"
              help={
                <>
                  Pongo2 template string that represents the snapshot name (used
                  for scheduled snapshots and unnamed snapshots), see{" "}
                  <a
                    href={`${docBaseLink}/reference/instance_options/#instance-options-snapshots-names`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Automatic snapshot names
                  </a>
                </>
              }
              type="text"
            />
          ),
        }),

        getStorageConfigurationRow({
          formik,
          label: "Expire after",
          name: "snapshots_expiry",
          help: "Controls when snapshots are to be deleted",
          defaultValue: "",
          children: (
            <Input
              placeholder="Enter expiry expression"
              type="text"
              help="Expects an expression like 1M 2H 3d 4w 5m 6y"
            />
          ),
        }),

        getStorageConfigurationRow({
          formik,
          label: "Schedule",
          name: "snapshots_schedule",
          defaultValue: "",
          children: (
            <SnapshotScheduleInput
              value={formik.values.snapshots_schedule}
              setValue={(val) =>
                void formik.setFieldValue("snapshots_schedule", val)
              }
            />
          ),
        }),
      ]}
    />
  );
};

export default StorageVolumeFormSnapshots;
