import React, { FC } from "react";
import {
  Icon,
  List,
  ContextualMenu,
  MainTable,
  Row,
  Tooltip,
} from "@canonical/react-components";
import NotificationRow from "./components/NotificationRow";
import { fetchProfiles } from "./api/profiles";
import BaseLayout from "./components/BaseLayout";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./util/queryKeys";
import useNotification from "./util/useNotification";
import usePanelParams from "./util/usePanelParams";
import DeleteProfileBtn from "./buttons/profiles/DeleteProfileBtn";
import EditProfileBtn from "./buttons/profiles/EditProfileBtn";

const ProfileList: FC = () => {
  const notify = useNotification();
  const panelParams = usePanelParams();

  const { data: profiles = [], error } = useQuery({
    queryKey: [queryKeys.profiles],
    queryFn: fetchProfiles,
  });

  if (error) {
    notify.failure("Could not load profiles.", error);
  }

  const headers = [
    { content: "Name", sortKey: "name" },
    { content: "Description", sortKey: "description" },
    { content: "Effects", className: "u-align--center" },
    { content: "Used by", sortKey: "used_by", className: "u-align--center" },
    { content: "Actions", className: "u-align--center" },
  ];

  const rows = profiles.map((profile) => {
    const actions = (
      <div>
        <Tooltip message="Edit profile" position="btm-center">
          <EditProfileBtn
            profile={profile}
            appearance=""
            label=""
            className=""
          />
        </Tooltip>
        {profile.name !== "default" && (
          <Tooltip message="Delete profile" position="btm-center">
            <DeleteProfileBtn name={profile.name} notify={notify} />
          </Tooltip>
        )}
      </div>
    );

    const touchesNetwork = Object.values(profile.devices).some(
      (device) => device.type === "nic"
    );
    const touchesStorage = Object.values(profile.devices).some(
      (device) => device.type === "disk"
    );
    const touchesCloudInit = Object.keys(profile.config).some((config) =>
      config.startsWith("cloud-init")
    );
    const touchesLimits = Object.keys(profile.config).some((config) =>
      config.startsWith("limits")
    );

    const effects = (
      <List
        inline
        items={[
          touchesNetwork ? (
            <Tooltip message="Network" key="1" position="btm-center">
              <Icon name="connected" />
            </Tooltip>
          ) : null,
          touchesStorage ? (
            <Tooltip message="Storage" key="2" position="btm-center">
              <Icon name="pods" />
            </Tooltip>
          ) : null,
          touchesCloudInit ? (
            <Tooltip message="Cloud init" key="3" position="btm-center">
              <Icon name="restart" />
            </Tooltip>
          ) : null,
          touchesLimits ? (
            <Tooltip message="Limit resources" key="4" position="btm-center">
              <Icon name="priority-low" />
            </Tooltip>
          ) : null,
        ].filter((n) => n)}
      />
    );

    const usedBy = <span>{profile.used_by?.length ?? "0"}</span>;

    return {
      columns: [
        {
          content: profile.name,
          role: "rowheader",
          "aria-label": "Name",
        },
        {
          content: profile.description,
          role: "rowheader",
          "aria-label": "Description",
        },
        {
          content: effects,
          role: "rowheader",
          className: "u-align--center",
          "aria-label": "Effects",
        },
        {
          content: usedBy,
          role: "rowheader",
          className: "u-align--center",
          "aria-label": "Used by",
        },
        {
          content: actions,
          role: "rowheader",
          "aria-label": "Actions",
          className: "u-align--center",
        },
      ],
      sortData: {
        name: profile.name,
        description: profile.description,
        used_by: profile.used_by,
      },
    };
  });

  return (
    <>
      <BaseLayout
        title="Profiles"
        controls={
          <ContextualMenu
            hasToggleIcon
            links={[
              {
                children: "Quick create profile",
                onClick: () => panelParams.openProfileFormGuided(),
              },
              {
                children: "Custom create profile (YAML)",
                onClick: () => panelParams.openProfileFormYaml(),
              },
            ]}
            position="right"
            toggleAppearance="positive"
            toggleLabel="Add profile"
          />
        }
      >
        <NotificationRow notify={notify} />
        <Row>
          <MainTable
            headers={headers}
            rows={rows}
            paginate={30}
            responsive
            sortable
            className="u-table-layout--auto"
          />
        </Row>
      </BaseLayout>
    </>
  );
};

export default ProfileList;
