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
}

export interface ITaxOffice {
  id: number;
  name: TaxOfficeEnum;
  value: string;
}

export interface ITaxOfficeUser {
  id: string;
  taxOffice: string;
  adminuser: string;
  add1: string;
  add2: string;
  phone: string;
  email: string
  primarycolor: string
  logourl: string
}

