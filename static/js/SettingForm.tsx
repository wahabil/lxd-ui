import React, { FC, useState } from "react";
import { Button, Form, Icon, Input } from "@canonical/react-components";
import { updateSettings } from "./api/server";
import { useFormik } from "formik";
import { LxdConfigOption } from "./types/common";
import { queryKeys } from "./util/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import NotificationRow from "./components/NotificationRow";
import useNotification from "./util/useNotification";

interface Props {
  option: LxdConfigOption;
  value: string | undefined;
}

const SettingForm: FC<Props> = ({ option, value }) => {
  const [isEditMode, setEditMode] = useState(false);
  const notify = useNotification();
  const queryClient = useQueryClient();

  const toFormikKey = (key: string) => {
    return key.replace(".", "___");
  };

  const toApiFormat = (input: boolean | string | undefined): string => {
    if (typeof input === "boolean") {
      return input ? "true" : "false";
    }
    if (input === undefined) {
      return "";
    }
    switch (option.type) {
      case "bool":
        return input ? "true" : "false";
      case "integer":
        return input.toString();
      default:
        return input;
    }
  };

  const formikKey = toFormikKey(option.key);

  const formik = useFormik({
    initialValues: {
      [formikKey]: value,
    },
    onSubmit: (values) => {
      const config = {
        [option.key]: toApiFormat(values[formikKey]),
      };
      updateSettings(config)
        .then(() => {
          formik.setSubmitting(false);
          void queryClient.invalidateQueries({
            queryKey: [queryKeys.settings],
          });
          notify.success("Setting saved.");
          setEditMode(false);
        })
        .catch((e) => {
          formik.setSubmitting(false);
          notify.failure("Error on save.", e);
        });
    },
  });

  const getInputType = (option: LxdConfigOption) => {
    switch (option.type) {
      case "bool":
        return "checkbox";
      case "integer":
        return "number";
      case "string":
      default:
        return "text";
    }
  };

  const getDefaultValue = () => {
    if (option.type === "bool") {
      return value === "true";
    }
    return value;
  };
  const defaultValue = getDefaultValue();

  return (
    <>
      {isEditMode ? (
        <Form onSubmit={formik.handleSubmit} stacked>
          <Input
            id={formikKey}
            name={formikKey}
            type={getInputType(option)}
            defaultValue={
              typeof defaultValue !== "boolean" ? defaultValue : undefined
            }
            defaultChecked={
              typeof defaultValue === "boolean" ? defaultValue : undefined
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
          <Button onClick={() => setEditMode(false)} type="button">
            Cancel
          </Button>
          <Button appearance="positive" type="submit">
            Save
          </Button>
        </Form>
      ) : (
        <>
          <Button
            appearance="base"
            className="u-no-margin"
            onClick={() => {
              setEditMode(true);
              notify.clear();
            }}
            hasIcon
          >
            <span>{value ? value : "-"}</span>
            <Icon name="edit" />
          </Button>
        </>
      )}
      <NotificationRow notify={notify} />
    </>
  );
};

export default SettingForm;
