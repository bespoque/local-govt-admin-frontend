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
