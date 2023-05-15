export type Dog = {
  id?: number;
  name: string;
  breed: string;
  breedId: number;
  size: Size;
  sex: Sex;
  altered: boolean;
  weightLbs: number;
  age: number;
  tricks: string[];
  owners?: any;
};

export enum Size {
  TEACUP = "TEACUP",
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
  X_LARGE = "X_LARGE",
}

export enum Sex {
  MALE = "MALE",
  FEMALE = "FEMALE",
}
