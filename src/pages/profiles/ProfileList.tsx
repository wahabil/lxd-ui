import React, { FC, useEffect, useState } from "react";
import {
  MainTable,
  Row,
  Button,
  SearchBox,
  Col,
} from "@canonical/react-components";
import { fetchProfiles } from "api/profiles";
import classnames from "classnames";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "util/queryKeys";
import { useNotify } from "context/notify";
import Loader from "components/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import ItemName from "components/ItemName";
import { getProfileInstances } from "util/usedBy";
import usePanelParams from "util/usePanelParams";
import { usePagination } from "util/pagination";
import useEventListener from "@use-it/event-listener";
import { updateTBodyHeight } from "util/updateTBodyHeight";
import Pagination from "components/Pagination";
import NotificationRow from "components/NotificationRow";

const ProfileList: FC = () => {
  const navigate = useNavigate();
  const notify = useNotify();
  const panelParams = usePanelParams();
  const { project } = useParams<{ project: string }>();
  const [query, setQuery] = useState<string>("");

  if (!project) {
    return <>Missing project</>;
  }
  const isDefaultProject = project === "default";

  const {
    data: profiles = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: [queryKeys.profiles, project],
    queryFn: () => fetchProfiles(project),
  });

  if (error) {
    notify.failure("Loading profiles failed", error);
  }

  const filteredProfiles = profiles.filter((item) => {
    if (query) {
      const q = query.toLowerCase();
      if (
        !item.name.toLowerCase().includes(q) &&
        !item.description.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const headers = [
    { content: "Name", sortKey: "name" },
    { content: "Description", sortKey: "description" },
    { content: "Used by", sortKey: "used_by", className: "u-align--right" },
  ];

  const rows = filteredProfiles.map((profile) => {
    return {
      columns: [
        {
          content: (
            <div className="u-truncate" title={profile.name}>
              <Link to={`/ui/${project}/profiles/detail/${profile.name}`}>
                <ItemName item={profile} />
              </Link>
            </div>
          ),
          role: "rowheader",
          "aria-label": "Name",
        },
        {
          content: profile.description,
          role: "rowheader",
          "aria-label": "Description",
        },
        {
          content: getProfileInstances(
            project,
            isDefaultProject,
            profile.used_by
          ).length,
          role: "rowheader",
          className: "u-align--right",
          "aria-label": "Used by",
        },
      ],
      sortData: {
        name: profile.name.toLowerCase(),
        description: profile.description.toLowerCase(),
        used_by: profile.used_by,
      },
    };
  });

  const pagination = usePagination(rows);

  useEventListener("resize", () => updateTBodyHeight("profile-table-wrapper"));
  useEffect(() => {
    updateTBodyHeight("profile-table-wrapper");
  }, [
    profiles,
    notify.notification,
    query,
    pagination.pageSize,
    pagination.currentPage,
  ]);

  return (
    <main className="l-main profile-list">
      <div
        className={classnames("p-panel", {
          "has-side-panel": !!panelParams.profile,
        })}
      >
        <div className="p-panel__header profile-list-header">
          <h1 className="p-heading--4 u-no-margin--bottom">Profiles</h1>
          <SearchBox
            className="search-box margin-right u-no-margin--bottom"
            name="search-profile"
            type="text"
            onChange={(value) => {
              setQuery(value);
            }}
            placeholder="Search"
            value={query}
            aria-label="Search"
          />
          <Button
            appearance="positive"
            className="u-no-margin--bottom"
            onClick={() => navigate(`/ui/${project}/profiles/create`)}
          >
            Create profile
          </Button>
        </div>
        <div className="p-panel__content profile-content">
          <NotificationRow />
          <Row className="no-grid-gap">
            <Col size={12}>
              <MainTable
                headers={headers}
                rows={pagination.pageData}
                sortable
                className="profile-table"
                id="profile-table-wrapper"
                emptyStateMsg={
                  isLoading ? (
                    <Loader text="Loading profiles..." />
                  ) : (
                    <>No profile found matching this search</>
                  )
                }
                onUpdateSort={pagination.updateSort}
              />
              <Pagination
                {...pagination}
                totalCount={profiles.length}
                visibleCount={
                  filteredProfiles.length === profiles.length
                    ? pagination.pageData.length
                    : filteredProfiles.length
                }
                keyword="profile"
              />
            </Col>
          </Row>
        </div>
      </div>
    </main>
  );
};

export default ProfileList;
