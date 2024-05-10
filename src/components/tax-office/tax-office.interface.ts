export enum TaxOfficeEnum {
  HEAD_OFFICE = "HEAD_OFFICE",
  LOKOJA_1 = "LOKOJA_1",
  ANYIGBA = "ANYIGBA",
  ANKPA = "ANKPA",
  IDAH = "IDAH",
  OKENE = "OKENE",
  AJAOKUTA = "AJAOKUTA",
  ISANLU = "ISANLU",
  KOTONKARFE = "KOTONKARFE",
  KABBA = "KABBA",
  OKENE_ADAVI = "OKENE_ADAVI",
  STORE = "STORE",
  DEFAULT = "DEFAULT",
}

export interface ITaxOffice {
  id: number;
  name: TaxOfficeEnum;
  value: string;
}

//addition
interface LocalGovts {
  id: string;
  name: string;
}
export const localGovernments: LocalGovts[] = [
  { id: "1", name: "IGALAMELA/ODOLU" },
  { id: "2", name: "MOPARUMO" },
  { id: "3", name: "YAGBA WEST" },
  { id: "4", name: "ANKPA" },
  { id: "5", name: "LOKOJA" },
  { id: "6", name: "BASSA" },
  { id: "7", name: "YAGBA EAST" },
  { id: "8", name: "OGORI-MAGONGO" },
  { id: "9", name: "OLAMABORO" },
  { id: "10", name: "OFU" },
  { id: "11", name: "KABBA/BUNU" },
  { id: "12", name: "OMALA" },
  { id: "13", name: "KOGI " },
  { id: "14", name: "ADAVI" },
  { id: "15", name: "OKEHI " },
  { id: "16", name: "AJAOKUTA" },
  { id: "17", name: "IJUMU" },
  { id: "18", name: "DEKINA" },
  { id: "19", name: "OKENE" },
  { id: "20", name: "IDAH" },
  { id: "21", name: "IBAJI" }
];

export interface ITaxOfficeUser {
  id: string;
  taxOffice: TaxOfficeEnum;
  adminuser: string;
  add1: string;
  add2: string;
  phone: string;
  email: string
  name: TaxOfficeEnum;
  value: string;
  primarycolor: string
  logourl: string
}

