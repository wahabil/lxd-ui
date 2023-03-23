import React, { FC } from "react";
import { Col, Input, Row, Textarea } from "@canonical/react-components";
import { FormikProps } from "formik/dist/types";
import { CreateProfileFormValues } from "pages/profiles/CreateProfileForm";

export interface ProfileDetailsFormValues {
  name: string;
  description?: string;
  type: string;
  readOnly: boolean;
}

export const profileDetailPayload = (values: CreateProfileFormValues) => {
  return {
    name: values.name,
    description: values.description,
  };
};

interface Props {
  formik: FormikProps<CreateProfileFormValues>;
  isCreateMode: boolean;
}

const ProfileDetailsForm: FC<Props> = ({ formik, isCreateMode }) => {
  const isReadOnly = formik.values.readOnly;

  return (
    <div className="details">
      <Row>
        <Col size={8}>
          <Input
            id="name"
            name="name"
            type="text"
            label="Profile name"
            placeholder="Enter name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
            error={formik.touched.name ? formik.errors.name : null}
            required
            disabled={!isCreateMode}
          />
          <Textarea
            id="description"
            name="description"
            label="Description"
            placeholder="Enter description"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.description}
            rows={Math.max(
              1,
              Math.ceil((formik.values.description?.length ?? 0) / 46)
            )}
            disabled={isReadOnly}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ProfileDetailsForm;
