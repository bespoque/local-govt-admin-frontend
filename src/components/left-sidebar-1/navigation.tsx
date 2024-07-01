import { Role } from "components/user/user.interface";
import { TaxOfficeEnum } from "components/tax-office/tax-office.interface";
import {
  GROUP_IDENTITY_MANAGEMENT,
  GROUP_COLLECTION,
  GROUP_USER_MANAGEMENT,
} from "./constants";
import {
  Collection,
  DashAssessmentIcon,
  DashIcon,
  IdManagement,
  Reports,
  RevChart,
  UserMgt,
} from "components/images";

export type NavigationState = {
  title: string;
  allowedRoles?: Role[];
  allowedLocations?: TaxOfficeEnum[];
  notAllowLocations?: TaxOfficeEnum[];
  url?: string | undefined;
  items: NavigationState[];
  icon?: React.ReactNode;
  badge?: {
    color: string;
    text: string | number;
  };
};

const dashboardNav = () => [
  {
    url: "/dashboard",
    icon: <DashIcon />,
    title: "Dashboard",
    items: [],
  },
];

const assessmentsNav = () => [
  {
    url: "/assessment",
    icon: <DashAssessmentIcon />,
    title: "Assessments",
    allowedRoles: GROUP_COLLECTION,
    items: [],
  },
];
const identityNav = () => [
  {
    url: "/identity-mgt",
    icon: <IdManagement />,
    title: "Identity Mgt",
    allowedRoles: GROUP_IDENTITY_MANAGEMENT,
    items: [],
  },
];

const revenueChartNav = () => [
  {
    url: "/revenue-chart",
    icon: <RevChart />,
    title: "Revenue Charts",
    items: [],
  },
];

const collectionNav = () => [
  {
    url: "/collections",
    icon: <Collection />,
    title: "Collection",
    allowedRoles: GROUP_COLLECTION,
    items: [],
  },
];

const reportingNav = () => [
  {
    url: "#",
    icon: <Reports />,
    title: "Reports",
    items: [],
  },
];

const userMgtNav = () => [
  {
    url: "/user-mgt",
    icon: <UserMgt />,
    title: "User Mgt",
    allowedRoles: GROUP_USER_MANAGEMENT,
    items: [],
  },
];


// const dashboardNav = (isProduction) =>
//   isProduction
//     ? []
//     : [
//       {
//         url: "/dashboard",
//         icon: <FiCompass size={20} />,
//         title: "Dashboard",
//         items: [],
//       },
//     ];

// const driversLicenceNav = (isProduction) =>
//   isProduction
//     ? []
//     : [
//       {
//         url: "/drivers-licence",
//         icon: <FiActivity size={20} />,
//         title: "Driver's Licence",
//         items: [
//           {
//             url: "/social-feed",
//             title: "Social feed",
//             items: [],
//           },
//           {
//             url: "/tasks",
//             title: "Tasks",
//             items: [],
//           },
//           {
//             url: "/inbox",
//             title: "Inbox",
//             items: [],
//           },
//           {
//             url: "/todo",
//             title: "Todo",
//             items: [],
//           },
//         ],
//       },
//     ];

// const vehicleLicenceNav = (isProduction) => {
//   return {
//     url: "/vehicle-licence",
//     icon: <FiActivity size={20} />,
//     title: "Vehicle Licence",
//     allowedRoles: GROUP_VEHICLE_LICENCE_CAPTURE,
//     items: [
//       {
//         title: "Vehicle Registration",
//         url: "/vehicle-licence/new/create",
//         allowedRoles: GROUP_VEHICLE_LICENCE_CAPTURE,
//         items: [
//           {
//             url: "/vehicle-licence/new/create",
//             allowedRoles: GROUP_VEHICLE_LICENCE_CAPTURE,
//             title: "Create",
//             items: [],
//           },
//           {
//             url: "/vehicle-licence/new",
//             allowedRoles: GROUP_VEHICLE_LICENCE_CAPTURE,
//             title: "Manage",
//             items: [],
//           },
//         ],
//       },
//       {
//         url: "/vehicle-licence/renewal/create",
//         title: "Vehicle Renewal",
//         allowedRoles: GROUP_VEHICLE_LICENCE_CAPTURE,
//         items: [
//           {
//             url: "/vehicle-licence/renewal/create",
//             allowedRoles: GROUP_VEHICLE_LICENCE_CAPTURE,
//             title: "Create",
//             items: [],
//           },
//           {
//             url: "/vehicle-licence/renewal",
//             allowedRoles: GROUP_VEHICLE_LICENCE_CAPTURE,
//             title: "Manage",
//             items: [],
//           },
//         ],
//       },

//       ...(isProduction
//         ? []
//         : [
//           {
//             url: "/vehicle-licence/ownership-change/create",
//             title: "CO Ownership",
//             allowedRoles: GROUP_VEHICLE_LICENCE_CAPTURE,
//             items: [
//               {
//                 url: "/vehicle-licence/ownership-change/create",
//                 allowedRoles: GROUP_VEHICLE_LICENCE_CAPTURE,
//                 title: "Create",
//                 items: [],
//               },
//               {
//                 url: "/vehicle-licence/ownership-change",
//                 allowedRoles: GROUP_VEHICLE_LICENCE_CAPTURE,
//                 title: "Manage",
//                 items: [],
//               },
//             ],
//           },
//         ]),
//     ],
//   };
// };
// const vehicleDealershipNav = (isProduction) =>
//   isProduction
//     ? []
//     : [
//       {
//         url: "/vehicle-dealership",
//         icon: <FiActivity size={20} />,
//         title: "Vehicle Dealership",
//         items: [
//           {
//             url: "/social-feed",
//             title: "Social feed",
//             items: [],
//           },
//           {
//             url: "/tasks",
//             title: "Tasks",
//             items: [],
//           },
//           {
//             url: "/inbox",
//             title: "Inbox",
//             items: [],
//           },
//           {
//             url: "/todo",
//             title: "Todo",
//             items: [],
//           },
//         ],
//       },
//     ];

// const inventoryNav = {
//   url: "inventory",
//   icon: <FiShoppingCart size={20} />,
//   title: "Inventory",
//   allowedRoles: GROUP_INVENTORY,
//   items: [
//     {
//       url: "/inventory/purchase-order",
//       title: "Purchase Order",
//       allowedLocations: [TaxOfficeEnum.HEAD_OFFICE],
//       items: [],
//       allowedRoles: GROUP_INVENTORY_PROCUREMENT,
//     },
//     {
//       url: "/inventory/receive-order",
//       title: "Receiving Order",
//       allowedLocations: [TaxOfficeEnum.STORE],
//       allowedRoles: GROUP_INVENTORY_RECEIVE,
//       items: [
//         {
//           url: "/inventory/receive-order/purchase-order",
//           title: "Sent Out POs",
//           allowedRoles: GROUP_INVENTORY_RECEIVE,
//           items: [],
//         },
//         {
//           url: "/inventory/receive-order",
//           title: "Manage",
//           allowedRoles: GROUP_INVENTORY_RECEIVE,
//           items: [],
//         },
//       ],
//     },
//     {
//       url: "/inventory/transfer",
//       title: "Transfer",
//       allowedRoles: [...GROUP_INVENTORY_TRANSFER, ...GROUP_INVENTORY_RECEIVE],
//       items: [
//         {
//           url: "/inventory/transfer",
//           title: "Initiate",
//           allowedRoles: GROUP_INVENTORY_TRANSFER,
//           items: [],
//         },
//         {
//           url: "/inventory/transfer/request",
//           title: "Requests",
//           allowedRoles: GROUP_INVENTORY_TRANSFER,
//           items: [
//             {
//               url: "/inventory/transfer/request/outgoing",
//               title: "Outgoing",
//               allowedRoles: GROUP_INVENTORY_TRANSFER,
//               items: [],
//             },
//             {
//               url: "/inventory/transfer/request/incoming",
//               title: "Incoming",
//               allowedRoles: GROUP_INVENTORY_TRANSFER,
//               items: [],
//             },
//           ],
//         },

//         {
//           url: "/inventory/transfer/receive",
//           title: "Receive",
//           notAllowLocations: [TaxOfficeEnum.STORE],
//           allowedRoles: GROUP_INVENTORY_RECEIVE,
//           items: [
//             {
//               url: "/inventory/transfer/receive/sent-out",
//               title: "Sent Transfers",
//               allowedRoles: GROUP_INVENTORY_RECEIVE,
//               items: [],
//             },
//             {
//               url: "/inventory/transfer/receive",
//               title: "Manage",
//               allowedRoles: GROUP_INVENTORY_RECEIVE,
//               items: [],
//             },
//           ],
//         },
//       ],
//     },

//     {
//       url: "/stock",
//       title: "Stock",
//       allowedRoles: GROUP_INVENTORY,
//       items: [],
//     },
//   ],
// };

// const usersNav = {
//   url: "/",
//   icon: <FiUsers size={20} />,
//   title: "Users",
//   items: [
//     {
//       url: "/users",
//       title: "Manage Users",
//       items: [],
//     },
//   ],
// };

export const navigationData = (isProduction): NavigationState[] => [
  {
    title: "Menus",
    items: [
      ...dashboardNav(),
      ...assessmentsNav(),
      ...identityNav(),
      ...revenueChartNav(),
      ...collectionNav(),
      ...reportingNav(),
      ...userMgtNav(),
      // ...driversLicenceNav(isProduction),
      // vehicleLicenceNav(isProduction),
      // ...vehicleDealershipNav(isProduction),
      // inventoryNav,
      // usersNav,
    ],
  },
];
