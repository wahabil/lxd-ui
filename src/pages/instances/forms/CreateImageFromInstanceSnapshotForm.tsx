import { FC } from "react";
import { LxdInstance, LxdInstanceSnapshot } from "types/instance";
import { useEventQueue } from "context/eventQueue";
import { useFormik } from "formik";
import { useToastNotification } from "context/toastNotificationProvider";
import { createImageAlias, createImageFromInstanceSnapshot } from "api/images";
import {
  ActionButton,
  Button,
  Form,
  Input,
  Modal,
} from "@canonical/react-components";
import * as Yup from "yup";
import { Link } from "react-router-dom";

interface Props {
  instance: LxdInstance;
  snapshot: LxdInstanceSnapshot;
  close: () => void;
}

const CreateImageFromInstanceSnapshotForm: FC<Props> = ({
  instance,
  snapshot,
  close,
}) => {
  const eventQueue = useEventQueue();
  const toastNotify = useToastNotification();

  const notifySuccess = () => {
    const created = (
      <Link to={`/ui/project/${instance.project}/images`}>created</Link>
    );
    toastNotify.success(
      <>
        Image {created} from snapshot <b>{snapshot.name}</b>.
      </>,
    );
  };

  const formik = useFormik<{ alias: string; isPublic: boolean }>({
    initialValues: {
      alias: "",
      isPublic: false,
    },
    validationSchema: Yup.object().shape({
      alias: Yup.string(),
    }),
    onSubmit: (values) => {
      const alias = values.alias;

      createImageFromInstanceSnapshot(instance, snapshot, values.isPublic)
        .then((operation) => {
          toastNotify.info(
            <>
              Creation of image from snapshot <b>{snapshot.name}</b> started.
            </>,
          );
          close();
          eventQueue.set(
            operation.metadata.id,
            (event) => {
              if (alias) {
                const fingerprint = event.metadata.metadata?.fingerprint ?? "";
                void createImageAlias(fingerprint, alias).then(notifySuccess);
              } else {
                notifySuccess();
              }
            },
            (msg) => {
              toastNotify.failure(
                `Image creation from snapshot "${snapshot.name}" failed.`,
                new Error(msg),
              );
            },
          );
        })
        .catch((e) => {
          toastNotify.failure(
            `Image creation from snapshot "${snapshot.name}" failed.`,
            e,
          );
        });
    },
  });

  return (
    <Modal
      close={close}
      title="Create image from instance snapshot"
      buttonRow={
        <>
          <Button
            appearance="base"
            className="u-no-margin--bottom"
            type="button"
            onClick={close}
          >
            Cancel
          </Button>
          <ActionButton
            appearance="positive"
            className="u-no-margin--bottom"
            loading={formik.isSubmitting}
            disabled={!formik.isValid}
            onClick={() => void formik.submitForm()}
          >
            Create image
          </ActionButton>
        </>
      }
    >
      <Form onSubmit={formik.handleSubmit}>
        <Input type="text" label="Instance" value={instance.name} disabled />
        <Input type="text" label="Snapshot" value={snapshot.name} disabled />
        <Input
          {...formik.getFieldProps("alias")}
          type="text"
          label="Alias"
          error={formik.touched.alias ? formik.errors.alias : null}
        />
        <Input
          {...formik.getFieldProps("isPublic")}
          type="checkbox"
          label="Make the image publicly available"
          error={formik.touched.isPublic ? formik.errors.isPublic : null}
        />
        {/* hidden submit to enable enter key in inputs */}
        <Input type="submit" hidden value="Hidden input" />
      </Form>
    </Modal>
  );
};

export default CreateImageFromInstanceSnapshotForm;
