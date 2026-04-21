import { gql } from "graphql-request";

export const TRACKER_QUERY = gql`
  query TrackerData {
    tasks {
      id
      name
      wikiLink
      kappaRequired
      lightkeeperRequired
      trader {
        name
      }
      requiredPrestige {
        prestigeLevel
      }
      taskRequirements {
        task {
          id
        }
      }
      objectives {
        __typename
        id
        type
        optional
        ... on TaskObjectiveItem {
          count
          foundInRaid
          items {
            id
            name
            shortName
            iconLink
            image512pxLink
          }
        }
        ... on TaskObjectiveQuestItem {
          count
          questItem {
            id
            name
            shortName
            iconLink
            image512pxLink
          }
        }
      }
    }
    prestige {
      prestigeLevel
      name
      conditions {
        __typename
        id
        type
        optional
        ... on TaskObjectiveItem {
          count
          foundInRaid
          items {
            id
            name
            shortName
            iconLink
            image512pxLink
          }
        }
        ... on TaskObjectiveTaskStatus {
          task {
            id
          }
          status
        }
      }
    }
    hideoutStations {
      id
      name
      levels {
        level
        itemRequirements {
          count
          item {
            id
            name
            shortName
            iconLink
            image512pxLink
          }
          attributes {
            type
            name
            value
          }
        }
      }
    }
  }
`;
