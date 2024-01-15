import React, { FC, ReactNode } from "react";
import { Row, Input, Select, Col } from "@canonical/react-components";
import { FormikProps } from "formik";
import {
  zfsDriver,
  dirDriver,
  btrfsDriver,
  getSourceHelpForDriver,
  cephDriver,
  getStorageDriverOptions,
} from "util/storageOptions";
import { StoragePoolFormValues } from "./StoragePoolForm";
import DiskSizeSelector from "components/forms/DiskSizeSelector";
import AutoExpandingTextArea from "components/AutoExpandingTextArea";
import { cephStoragePoolDefaults } from "util/storagePool";
import { useSettings } from "context/useSettings";

interface Props {
  formik: FormikProps<StoragePoolFormValues>;
}

const StoragePoolFormMain: FC<Props> = ({ formik }) => {
  const { data: settings } = useSettings();
  const getFormProps = (id: "name" | "description" | "size" | "source") => {
    return {
      id: id,
      name: id,
      onBlur: formik.handleBlur,
      onChange: formik.handleChange,
      value: formik.values[id],
      error: formik.touched[id] ? (formik.errors[id] as ReactNode) : null,
      placeholder: `Enter ${id.replaceAll("_", " ")}`,
    };
  };

  const isCephDriver = formik.values.driver === cephDriver;
  const isDirDriver = formik.values.driver === dirDriver;
  const storageDriverOptions = getStorageDriverOptions(settings);

  return (
    <>
      <Row>
        <Col size={12}>
          <Input
            {...getFormProps("name")}
            type="text"
            label="Name"
            required
            disabled={!formik.values.isCreating || formik.values.readOnly}
            help={
              !formik.values.isCreating
                ? "Cannot rename storage pools"
                : undefined
            }
          />
          <AutoExpandingTextArea
            {...getFormProps("description")}
            label="Description"
            disabled={formik.values.readOnly}
            dynamicHeight
          />
          <Select
            id="driver"
            name="driver"
            help={
              !formik.values.isCreating
                ? "Driver can't be changed"
                : formik.values.driver === zfsDriver
                  ? "ZFS gives best performance and reliability"
                  : undefined
            }
            label="Driver"
            options={storageDriverOptions}
            onChange={(target) => {
              const val = target.target.value;
              if (val === dirDriver) {
                void formik.setFieldValue("size", "");
              }
              if (val === btrfsDriver) {
                void formik.setFieldValue("source", "");
              }
              if (val !== cephDriver) {
                const cephConfigFields = Object.keys(cephStoragePoolDefaults);
                for (const field of cephConfigFields) {
                  void formik.setFieldValue(field, undefined);
                }
              }

              void formik.setFieldValue("driver", val);
            }}
            value={formik.values.driver}
            required
            disabled={!formik.values.isCreating || formik.values.readOnly}
          />
          {!isCephDriver && !isDirDriver && (
            <DiskSizeSelector
              label="Size"
              value={formik.values.size}
              help={
                formik.values.driver === dirDriver
                  ? "Not available"
                  : "When left blank, defaults to 20% of free disk space. Default will be between 5GiB and 30GiB"
              }
              setMemoryLimit={(val?: string) =>
                void formik.setFieldValue("size", val)
              }
              disabled={
                formik.values.driver === dirDriver || formik.values.readOnly
              }
            />
          )}
          <Input
            {...getFormProps("source")}
            type="text"
            disabled={
              formik.values.driver === btrfsDriver ||
              !formik.values.isCreating ||
              formik.values.readOnly
            }
            help={
              formik.values.isCreating
                ? getSourceHelpForDriver(formik.values.driver)
                : "Source can't be changed"
            }
            label="Source"
          />
        </Col>
      </Row>
    </>
  );
};

export default StoragePoolFormMain;
