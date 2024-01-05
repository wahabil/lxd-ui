import React, { FC, useState } from "react";
import { Button, useNotify } from "@canonical/react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "util/queryKeys";
import SubmitButton from "components/SubmitButton";
import { createStorageVolume } from "api/storage-pools";
import NotificationRow from "components/NotificationRow";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { testDuplicateStorageVolumeName } from "util/storageVolume";
import BaseLayout from "components/BaseLayout";
import {
  StorageVolumeFormValues,
  volumeFormToPayload,
} from "pages/storage/forms/StorageVolumeForm";
import StorageVolumeForm from "pages/storage/forms/StorageVolumeForm";
import { MAIN_CONFIGURATION } from "pages/storage/forms/StorageVolumeFormMenu";
import { slugify } from "util/slugify";
import { POOL } from "../StorageVolumesFilter";
import FormFooterLayout from "components/forms/FormFooterLayout";

const StorageVolumeCreate: FC = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const queryClient = useQueryClient();
  const [section, setSection] = useState(slugify(MAIN_CONFIGURATION));
  const controllerState = useState<AbortController | null>(null);
  const { project } = useParams<{ project: string }>();
  const [searchParams] = useSearchParams();

  if (!project) {
    return <>Missing project</>;
  }

  const StorageVolumeSchema = Yup.object().shape({
    name: Yup.string()
      .test(
        ...testDuplicateStorageVolumeName(project, "custom", controllerState),
      )
      .required("This field is required"),
  });

  const formik = useFormik<StorageVolumeFormValues>({
    initialValues: {
      content_type: "filesystem",
      volumeType: "custom",
      name: "",
      project: project,
      pool: searchParams.get(POOL) || "",
      size: "GiB",
      readOnly: false,
      isCreating: true,
      entityType: "storageVolume",
    },
    validationSchema: StorageVolumeSchema,
    onSubmit: (values) => {
      const volume = volumeFormToPayload(values, project);
      createStorageVolume(values.pool, project, volume)
        .then(() => {
          void queryClient.invalidateQueries({
            queryKey: [queryKeys.storage],
          });
          void queryClient.invalidateQueries({
            queryKey: [queryKeys.projects, project],
          });
          void queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === queryKeys.volumes,
          });
          navigate(
            `/ui/project/${project}/storage/volumes`,
            notify.queue(
              notify.success(`Storage volume ${values.name} created.`),
            ),
          );
        })
        .catch((e) => {
          formik.setSubmitting(false);
          notify.failure("Storage volume creation failed", e);
        });
    },
  });

  const submitForm = () => {
    void formik.submitForm();
  };

  return (
    <BaseLayout title="Create volume" contentClassName="storage-volume-form">
      <NotificationRow />
      <StorageVolumeForm
        formik={formik}
        section={section}
        setSection={(val) => setSection(slugify(val))}
      />
      <FormFooterLayout>
        <Button
          appearance="base"
          onClick={() => navigate(`/ui/project/${project}/storage/volumes`)}
        >
          Cancel
        </Button>
        <SubmitButton
          isSubmitting={formik.isSubmitting}
          isDisabled={!formik.isValid}
          onClick={submitForm}
          buttonLabel="Create"
        />
      </FormFooterLayout>
    </BaseLayout>
  );
};

export default StorageVolumeCreate;
